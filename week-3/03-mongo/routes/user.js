const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db/index.js");

// ### User routes

// - POST /users/signup
//   Description: Creates a new user account.
//   Input: { username: 'user', password: 'pass' }
//   Output: { message: 'User created successfully' }

// User Routes
router.post('/signup', (req, res) => {
    let username = req.headers.username;
    let password = req.headers.password;
    console.log(username, " ", password)

    const newUserDoc = new User({
        "username": username,
        "password": password
    });

    User.findOne({ username: username }).then((doc) => {
        if (doc !== null) {
            res.json({ "message": "User already exists." });
        } else {
            newUserDoc.save().then((doc) => {
                console.log(doc);
                res.json({ "message": 'User created successfully' });
            }).catch((err) => res.json({ "message": 'User not added.' }));
        }
    });
});

// - GET /users/courses
//   Description: Lists all the courses.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

router.get('/courses', (req, res) => {
    // Implement listing all courses logic
    Course.find({}).then((allCourses) => {
        res.json(allCourses);
    }).catch((err) => {
        res.json({"message": "Error Querying Courses."});
    });

});


// - POST /users/courses/:courseId
//   Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { message: 'Course purchased successfully' }

router.post('/courses/:courseId', userMiddleware, (req, res) => {
    let username = req.headers.username;

    User.findOne({ username: username }).then((doc) => {
        if (doc !== null) {
            const courseId = req.params.courseId;

            Course.findOne({ "id": courseId }).then((course) => {
                if (!doc.courses) {
                    doc.courses = [];
                }

                doc.courses.push(course);
                res.json({ "message": 'Course purchased successfully' });
            }).catch((err) => res.json({ "message": "Invalid Course Id." }));
        } else {
            res.json({ "message": "User does not exist to purchase course." });
        }
    });
});




// - GET /users/purchasedCourses
//   Description: Lists all the courses purchased by the user.
//   Input: Headers: { 'username': 'username', 'password': 'password' }
//   Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

router.get('/purchasedCourses', userMiddleware, (req, res) => {
    let username = req.headers.username;
    let password = req.headers.password;

    User.findOne({ username: username }).then((doc) => {
        if (doc !== null) {
            if (!doc.courses) {
                res.json({ "message": "No purchased courses." });
            } else {
                res.json({ "purchasedCourses": doc.courses });
            }
        } else {
            res.json({ "message": "User does not exist." });
        }
    });
});

module.exports = router;

const {User, Course} = require("../db")
const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const jwt = require("jsonwebtoken")
const JWT_SECRET_KEY = require('../config')


// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.headers.username;
    const password = req.headers.password;

    User.create({
        username: username,
        password: password
    }).then((value) => {
        res.json({"msg": `User created successfully ${value._id}`})
    }).catch((err) => {
        console.log(err)
        res.json({"msg": "Error signing up user."})
    })

});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;
    User.findOne({
        username: username,
        password: password
    }).then(() => {
        const token = jwt.sign({
            username: username
        }, JWT_SECRET_KEY)

        res.json({token})
    }).catch((e)=> {
        console.log(e)
        res.status(411).json({msg: "Incorrect username or password"})
    })

});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const listOfCourses = await Course.find({})
    res.json({listOfCourses})

});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    User.updateOne({
        username: req.headers.username,
    }, {
        $push: {
            coursePurchased: req.params.courseId
        }
    }).catch((e) => {
        console.log(e)
    })

    res.json({ msg: "purchase complete!"})
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await User.findOne({
        username: req.username
    })

    const courses = await Course.find({
        _id : {
            "$in": user.coursePurchased
        }
    })

    res.json({"courses": courses})
});

module.exports = router
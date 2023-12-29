const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin, Course} = require("../db/index.js")


router.post('/signup', async (req, res) => {
    console.log("Trying to signup")
    try {
        let username = req.headers.username;
        let password = req.headers.password;

        const adminExists = await Admin.exists({ username: username });
        if (adminExists) {
            res.json({ "message": "Admin already exists." });
        } else {
            const newAdminDoc = new Admin({
                "username": username,
                "password": password
            });
            await newAdminDoc.save();
            console.log(newAdminDoc);
            res.json({ "message": 'Admin created successfully' });
        }
    } catch (error) {
        console.error(error);
        res.json({ "message": 'Error creating admin.' });
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    try {
        const newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            imageLink: req.body.imageLink
        });

        await newCourse.save();
        res.json({ "message": 'Course created successfully' });
    } catch (error) {
        console.error(error);
        res.json({ "message": 'Error creating course.' });
    }
});

router.get('/courses', adminMiddleware, async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.json({ "message": 'Error fetching courses.' });
    }
});

module.exports = router;
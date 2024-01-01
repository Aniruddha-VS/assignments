const { Admin, Course } = require("../db");
const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const jwt = require("jsonwebtoken")
const router = Router();
const JWT_SECRET_KEY = require('../config')


// Admin Routes
router.post('/signup', (req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;
    
    Admin.create({
        username: username,
        password: password
    }).then((value) => {
        res.json({"msg": "Admin Created Successfully"})
    }).catch((err) => {
        console.log(err)
        res.json({"msg": "Error creating Admin"})
    })

});

router.post('/signin', (req, res) => {
    // Implement admin signup logic
    const username = req.headers.username;
    const password = req.headers.password;
    Admin.findOne({
        "username": username,
        "password": password
    }).then(() => {
        const token = jwt.sign({
            username: username
        }, JWT_SECRET_KEY)
        res.json({token})
    }).catch(()=> {
        msg: "Invalid username or password."
    })
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const course = await Course.create({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        published: req.body.published
    })

    res.json({"msg": `Course created successfully ${course._id}`})

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const courses = await Course.find({})
    res.json(courses)

});

module.exports = router;
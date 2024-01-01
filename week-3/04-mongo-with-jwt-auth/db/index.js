const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://dbUserAni:dbPassAni@cluster-mongo.gxgbsqq.mongodb.net/course-app-with-auth2');

// Define schemas
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String,
    

});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    username: String,
    password: String,
    coursePurchased: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    price: Number,
    description: String,
    published: Boolean
    
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

module.exports = {
    Admin,
    User,
    Course
}

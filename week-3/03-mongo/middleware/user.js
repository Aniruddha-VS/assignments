const {Admin,User, Course} = require("../db/index")

function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const username = req.headers.username;
    const password = req.headers.password;
    
    User.findOne({ username: `/^${username}/` }).then((user) => {
        if (user !== null ) {
            if (user["password"] === password ) {
                next()
            } else {
                res.json({"message" : "Incorrect password"})
            }
        } else {
            res.json({"message": "username does not exist."})
        }
    });
}

module.exports = userMiddleware;
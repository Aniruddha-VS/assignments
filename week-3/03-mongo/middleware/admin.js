const {Admin, User, Course} = require("../db/index")

// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // Implement admin auth logic
    // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
    const username = req.headers.username;
    const password = req.headers.password;

    console.log(Admin)
    
    Admin.findOne({ username: username }).then((user) => {
        if (user !== null ) {
            if (user["password"] === password ) {
                next()
            } else {
                res.json({"message" : "Incorrect password."})
            }
        } else {
            res.json({"message": "Admin userid does not exist."})
        }
    });
}

module.exports = adminMiddleware;
const express = require('express');
const adminRouter = require("./routes/admin")
const userRouter = require("./routes/user");
const bodyParser = require('body-parser');

const PORT = 3000;

const app = express();
// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/admin", adminRouter)
app.use("/user", userRouter)

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

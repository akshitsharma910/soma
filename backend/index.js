require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const userRoute = require("./routes/user.route");
const postFunctionRoute = require("./routes/postFunctions.route");
const { authenticateJWT } = require("./services/auth");
const { handleHomePage } = require("./controllers/postFunctions.controller");
// const { showUserPost } = require("./controllers/user.controller");
const { get } = require("http");
const app = express();
const port = process.env.PORT || 5001;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", authenticateJWT, handleHomePage);
// app.get("/user/posts", authenticateJWT, showUserPost);

app.use("/posts", postFunctionRoute);
app.use("/user", userRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

require("dotenv").config();
const express=require("express");
const cookieParser=require("cookie-parser")
const path=require("path");
const mongoose=require("mongoose"); 
const userRoute=require("./routes/user.route")
const postFunctionRoute=require("./routes/postFunctions.route")
const Post=require("./models/postFunctions.model");
const { authenticateJWT } = require("./services/auth");
const app=express();
const PORT=9999;


mongoose.connect(process.env.MONGO_URL).then(e=>console.log("MongoDB Connected"))


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))




app.get("/",authenticateJWT, async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "fullName").exec(); 
        const user = req.user || null; 
        
        return res.render("home", { posts, message: "Welcome to Soma", user }); 
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.redirect("/user/login");
    }
});


app.use("/posts",postFunctionRoute);
app.use("/user",userRoute);




app.listen(PORT,()=>{
    console.log("Server Started on Port: "+"http://localhost:"+PORT);
})
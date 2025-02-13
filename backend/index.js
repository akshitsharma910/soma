require("dotenv").config();
const express=require("express");
const path=require("path");
const mongoose=require("mongoose"); 
const userRoute=require("./routes/user.route")
const postFunctionRoute=require("./routes/postFunctions.route")
const Post=require("./models/postFunctions.model")
const app=express();
const PORT=9999;


mongoose.connect(process.env.MONGO_URL).then(e=>console.log("MongoDB Connected"))


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}))




app.get("/",async (req,res)=>{
    try {
        const posts = await Post.find().populate("author", "name").exec(); 
        return res.render("home", { posts, message: "Welcome to Soma" }); 
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.use("/posts",postFunctionRoute);
app.use("/user",userRoute);




app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})
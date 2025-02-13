require("dotenv").config();
const express=require("express");
const cookieParser=require("cookie-parser")
const path=require("path");
const mongoose=require("mongoose"); 
const userRoute=require("./routes/user.route")
const postFunctionRoute=require("./routes/postFunctions.route")
const { authenticateJWT } = require("./services/auth");
const { handleHomePage } = require("./controllers/postFunctions.controller");
const app=express();
const PORT=9999;


mongoose.connect(process.env.MONGO_URL).then(e=>console.log("MongoDB Connected"))


app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))




app.get("/",authenticateJWT,handleHomePage);


app.use("/posts",postFunctionRoute);
app.use("/user",userRoute);




app.listen(PORT,()=>{
    console.log("Server Started on Port: "+"http://localhost:"+PORT);
})
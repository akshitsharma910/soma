const User=require("../models/user.model");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const SECRET_KEY = process.env.SECRET_KEY || "chintu";

function handleUserSignup(req,res){
    return res.render("signup")
}


function handleUserLogin(req,res){
    return res.render("login")
}

function handleUserLogout(req,res){
    res.clearCookie("token")
    return res.redirect("/user/login");
}

async function createUser(req,res){
    const {fullName,email,password}=req.body;

    const hashedPass=await bcrypt.hash(password,10);


    await User.create({
        fullName,
        email,
        password:hashedPass,
    });

    return res.redirect("/user/login");
}

async function verifyUser(req,res){
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});

        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(401).json({message:"invalid credentials"});
        }

       const token=jwt.sign({id:user._id,email:user.email,fullName:user.fullName},SECRET_KEY,{expiresIn:"1h"})

       res.cookie("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production"})

        return res.redirect("/");
    }catch(err){
        console.log("Error during login: ",err)
    }
}


function handleUserForgot(req,res){
    res.render("forgot");
}


module.exports={
    handleUserSignup,
    handleUserLogin,
    handleUserForgot,
    handleUserLogout,
    createUser,
    verifyUser,

}
const express=require("express");
const { handleUserSignup, handleUserLogin, createUser, verifyUser, handleUserForgot, handleUserLogout, showUserPost } = require("../controllers/user.controller");
const { authenticateJWT }=require("../services/auth")
const router=express.Router();



router.get("/signup",handleUserSignup)
router.get("/login",handleUserLogin)
router.post("/logout",handleUserLogout)
router.get("/forgot",handleUserForgot)
router.get("/posts",authenticateJWT,showUserPost)

router.post("/signup",createUser)
router.post("/login",verifyUser);







module.exports=router;
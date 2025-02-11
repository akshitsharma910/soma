const express=require("express");
const { handleUserSignup, handleUserLogin, createUser, verifyUser, handleUserForgot, handleUserLogout } = require("../controllers/user.controller");
const router=express.Router();



router.get("/signup",handleUserSignup)
router.get("/login",handleUserLogin)
router.post("/logout",handleUserLogout)
router.get("/forgot",handleUserForgot)

router.post("/signup",createUser)
router.post("/login",verifyUser);







module.exports=router;
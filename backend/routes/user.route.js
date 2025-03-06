const express = require("express");
const { handleUserSignup, handleUserLogin, createUser, verifyUser, handleUserForgot, handleUserLogout, showUserPost, showProfile, editProfile } = require("../controllers/user.controller");
const { authenticateJWT } = require("../services/auth")
const router = express.Router();



router.get("/signup", handleUserSignup)
router.get("/login", handleUserLogin)
router.post("/logout", handleUserLogout)
router.get("/forgot", handleUserForgot)
router.get("/posts", authenticateJWT, showUserPost)
router.get("/profile", authenticateJWT, showProfile)
router.get("/editProfile", authenticateJWT, editProfile)

router.post("/signup", createUser)
router.post("/login", verifyUser);







module.exports = router;
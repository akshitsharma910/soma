const express=require("express");
const { addPost, showPost, deletePost} = require("../controllers/postFunctions.controller");
const {authenticateJWT}=require("../services/auth")
const router=express.Router();


router.get("/add",(req,res)=>{
    return res.render("addPost");
})
router.post("/add",authenticateJWT,addPost)


router.get("/:id",authenticateJWT,showPost)


router.delete("/:id",authenticateJWT,deletePost)






module.exports=router;
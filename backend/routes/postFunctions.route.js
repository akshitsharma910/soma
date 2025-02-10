const express=require("express");
const { addPost, showPost } = require("../controllers/postFunctions.controller");
const router=express.Router();


router.get("/add",(req,res)=>{
    return res.render("addPost");
})
router.post("/add",addPost)


router.get("/:id",showPost)






module.exports=router;
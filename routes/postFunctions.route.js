const express=require("express");
const { getPostPage,addPost, showPost, deletePost, addComment, deleteComment, searchPost} = require("../controllers/postFunctions.controller");
const {authenticateJWT}=require("../services/auth")
const Comment=require("../models/comment.model")
const Post=require("../models/postFunctions.model")
const router=express.Router();


router.get("/add",getPostPage)
router.post("/add",authenticateJWT,addPost)
router.get("/:id",authenticateJWT,showPost)
router.delete("/:id",authenticateJWT,deletePost)
router.post("/:id/comment",authenticateJWT,addComment);
router.get("/:id/comment",authenticateJWT,showPost)
router.delete("/:postId/comment/:commentId", authenticateJWT, deleteComment)
router.post("/search", searchPost);


module.exports=router;
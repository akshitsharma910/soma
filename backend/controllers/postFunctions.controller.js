const Post=require("../models/postFunctions.model")
const User=require("../models/user.model")
const mongoose=require("mongoose")
const Comment=require("../models/comment.model")


async function handleHomePage(req,res){
        try {
            const posts = await Post.find().populate("author", "fullName").exec(); 
            const user = req.user || null; 
            
            return res.render("home", { posts, message: "Welcome to Soma", user }); 
        } catch (error) {
            console.error("Error fetching posts:", error);
            return res.redirect("/user/login");
        }
}



async function getPostPage(req,res) {
        return res.render("addPost");
}

async function addPost(req, res) {

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    try {
        const { title, content, genre } = req.body;

        const post = await Post.create({
            title,
            content,
            genre,
            author: new mongoose.Types.ObjectId(req.user.id),   
        });


        return res.redirect("/");
    } catch (error) {
        console.error("Error Creating Post:", error);
        return res.status(500).send("Server error");
    }
}


async function showPost(req, res) {
    try {
        const postId = req.params.id;

        // Fetch post with author details
        const post = await Post.findById(postId).populate("author");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Fetch comments related to the post
        const comments = await Comment.find({ post: postId })
            .populate("author", "fullName") // Populate author field with fullName only
            .sort({ createdAt: -1 }) // Sort by latest comment first
            .lean(); // Convert to plain objects

        // Render the page with data
        res.render("showPost", { post, comments, user: req.user || null });
    } catch (error) {
        console.error("Error fetching post:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}



async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const userId = req.user.id;  

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);
        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


async function addComment(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { content } = req.body;
        const postId = req.params.id;

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "Comment cannot be empty" });
        }

        const newComment = new Comment({
            content,
            post: postId,  // ✅ Correct reference to Post
            author: req.user.id,  // ✅ Correct reference to User
        });

        await newComment.save();

        
        await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

        res.redirect(`/posts/${postId}`)
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
}


async function deleteComment(req,res){
        const { postId, commentId } = req.params;
    
        try {
            // Find the post by its ID
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
    
            // Find the comment by its ID
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }
    
            // Check if the comment belongs to the user trying to delete it
            if (comment.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "You can only delete your own comments!" });
            }
    
            // Remove the comment from the Post document (from the comments array)
            post.comments = post.comments.filter(c => c.toString() !== commentId);
            await post.save();
    
            // Now remove the comment from the Comment collection
            await Comment.findByIdAndDelete(commentId);
    
            // Respond with a success message
            return res.status(200).json({ message: "Comment deleted successfully" });
    
        } catch (error) {
            console.error("Error deleting comment:", error);
            return res.status(500).json({ message: "Server error" });
        }
    }







module.exports={
    getPostPage,
    addPost,
    showPost,
    deletePost,
    handleHomePage,
    addComment,
    deleteComment
}
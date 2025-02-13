const Post=require("../models/postFunctions.model")
const User=require("../models/user.model")
const mongoose=require("mongoose")


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

        const post = await Post.findById(postId).populate("author");

        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        res.render("showPost", { post, user: req.user || null });
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





module.exports={
    addPost,
    showPost,
    deletePost,
}
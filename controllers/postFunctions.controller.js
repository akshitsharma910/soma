const Post = require("../models/postFunctions.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

async function handleHomePage(req, res) {
    try {
        const posts = Post.findAll();
        const user = req.user || null;

        return res.render("home", { posts, message: "Welcome to Soma", user });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.redirect("/user/login");
    }
}

// async function getMyPost(req, res) {
//     try {
//         const posts = Post.findByAuthorId(req.user.id);
//         return res.render("home", { posts, message: "Welcome to Soma", user: req.user });
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }

async function getPostPage(req, res) {
    return res.render("addPost");
}

async function addPost(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    try {
        const { title, content, genre } = req.body;

        const post = Post.create({
            title,
            content,
            genre,
            author: req.user.fullName,
            authorId: req.user.id,
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

        const post = Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comments = Comment.findByPostId(postId);

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

        const post = Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.authorId !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this post" });
        }

        Post.deleteById(postId);
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

        const newComment = Comment.create({
            content,
            post: postId,
            author: req.user.fullName,
            authorId: req.user.id,
        });

        Post.addComment(postId, newComment);
        res.redirect(`/posts/${postId}`);
    } catch (error) {
        console.error("Error posting comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function deleteComment(req, res) {
    const {postId, commentId} = req.params;

    try {
        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Find the comment by its ID
        const comment = await Comment.findByCommentId(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is the author of the comment
        if (comment.authorId !== req.user.id) {
            console.log(comment.authorId);
            console.log(req.user.id);
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        // Delete the comment from the Post document (from the comments array)
        post.comments = post.comments.filter(comment => comment.id !== commentId);
        await Post.update({ id: postId }, { $pull: { comments: { id: commentId } } });

        // Delete the comment from the Comment data
        Comment.findByIdAndDelete(commentId);
        // Return a success message
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function searchPost(req, res) {
    try {
        let searchInput = req.body.searchInput;
        console.log(searchInput)
        if (!searchInput) return res.status(400).json({ message: "searchInput is required" });

        const results = await Post.find({
            $or: [
                { title: { $regex: searchInput, $options: "i" } },
                { content: { $regex: searchInput, $options: "i" } }
            ]
        });

        res.render("search", {
            results,
            searchInput,
            user: req.user || null
        })
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


module.exports = {
    getPostPage,
    addPost,
    showPost,
    deletePost,
    handleHomePage,
    addComment,
    deleteComment,
    searchPost,
    // getMyPost,
};

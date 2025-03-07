const Post=require("../models/postFunctions.model")

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

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}


module.exports={
    searchPost,
    
}
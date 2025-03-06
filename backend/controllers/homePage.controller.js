const Post=require("../models/postFunctions.model")

async function searchPost(req, res) {
    try {
        const { query } = req.body;
        console.log(query)
        if (!query) return res.status(400).json({ message: "Query is required" });

        const results = await Post.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } }
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
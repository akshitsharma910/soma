const Post=require("../models/postFunctions.model")



async function addPost(req,res){
    console.log(req.body)
    const {title,content,author,genre}=req.body;
    await Post.create({
        title,content,author,genre
    });
    return res.redirect("/");
}


async function showPost(req,res){
    const id=req.params.id;

    const post=await Post.findById(id);


    res.render("showPost",{post});
}



module.exports={
    addPost,
    showPost,

}
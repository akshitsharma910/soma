const {Schema,model,mongoose}=require("mongoose");

const User=require("./user.model")
const Comment=require("./comment.model")


const postSchema=new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String},
    genre:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:User},
    upvotes:{type:Number,default:0},
    downvotes:{type:Number,default:0},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:Comment}]

},{timestamps:true})


const Post=model("post",postSchema);

module.exports=Post;
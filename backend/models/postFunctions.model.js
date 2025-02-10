const {Schema,model,mongoose}=require("mongoose");


const postSchema=new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String},
    genre:{type:String,required:true},
    author:{type: String,required:true},
    upvotes:{type:Number,default:0},
    downvotes:{type:Number,default:0},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}]

},{timestamps:true})


const Post=model("post",postSchema);

module.exports=Post;
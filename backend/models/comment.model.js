const {Schema,model,mongoose}=require("mongoose");
const User=require("./user.model")
const Post=require("./postFunctions.model")

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, 
  author: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true }, 
  content: { type: String, required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  voters:{type:[mongoose.Schema.Types.ObjectId],ref:User,default:[]},
},{timestamps:true});


const Comment=model("comment",commentSchema);

module.exports = Comment;
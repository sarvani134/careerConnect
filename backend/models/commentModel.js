const mongoose=require("mongoose")
const User=require("./userModel")
const Post=require("./postModel")
const Schema=mongoose.Schema
const CommentSchema=new Schema(
    {
       
            userId:{
                type:Schema.Types.ObjectId,
                ref:'User'

            },
            postId:{
                 type:Schema.Types.ObjectId,
                ref:'Post'

            },
            body:{
                type:String,
               
            }
    }
)
const Comment=mongoose.model('Comment',CommentSchema)
module.exports=Comment

const mongoose=require("mongoose")
const User=require("./userModel")

const Schema=mongoose.Schema
const postSchema=new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User'
          

        },
        body:{
            type:String

        },
        likes:{
            type:Number,
            default:0

        },
        likedBy:[{
            type:Schema.Types.ObjectId,
            ref:'User'
        }],
        createdAt:{
            type:Date,
            default:Date.now

        },
        updatedAt:{
            type:Date,
              default:Date.now

        },
        media: {
            url: { type: String, default: "" },
            filename: { type: String, default: "" }
        },
        active:{
            type:Boolean,
            default:true

        },
        fileType:{
            type:String,
default:''
        }

    }
)
const Post=mongoose.model('Post',postSchema)
module.exports=Post

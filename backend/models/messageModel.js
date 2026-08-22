const mongoose=require("mongoose")
const Schema=mongoose.Schema


const messageSchema=new Schema({
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User"

    },
    receiverId:{
          type:Schema.Types.ObjectId,
        ref:"User"

    },
    body:{
          type:String,
        required:true

    },
   
    keepStar:{
        type:Boolean,
        default:false

    },
    seen:{
        type:Boolean,
        default:false
    },
   
   
},{
    timestamps:true
})
const messageModel=mongoose.model("message",messageSchema);
module.exports=messageModel


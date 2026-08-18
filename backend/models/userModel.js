const mongoose=require("mongoose")

const Schema=mongoose.Schema

const userSchema=new Schema({
    name:{
        type:String,
        required:true

    },
    username:{ 
        type:String,
        required:true

    },
    email:{
         type:String,
        required:true

    },
    active:{
         type:Boolean,
         default:true
       

    },
    password:{
         type:String,
        required:true

    },
    profilePicture: {
        url: { type: String, default: "" },
        filename: { type: String, default: "" }
    },
    token:{
        type:String

    },
    createdAt:{
         type:Date,
        default:Date.now
    }


})
const User=mongoose.model('User',userSchema)
module.exports=User;

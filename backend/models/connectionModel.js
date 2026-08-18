const mongoose=require("mongoose")
const User=require("./userModel")

const Schema=mongoose.Schema
const ConnectionSchema=new Schema(
    {
       
            userId:{
                type:Schema.Types.ObjectId,
                ref:'User'

            },
            connectionId:{
                 type:Schema.Types.ObjectId,
                ref:'User'

            },
            status_accepted:{
                type:Boolean,
                default:false
            }
    }
)
const Connection=mongoose.model('Connection',ConnectionSchema)
module.exports=Connection

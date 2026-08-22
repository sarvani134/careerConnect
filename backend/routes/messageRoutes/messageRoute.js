const express=require("express")
const { getMessages, addMessage } = require("../../controllers/messageControllers/messageController")
const messageRouter=express.Router()

messageRouter.get("/getMessages",getMessages)

messageRouter.post("/addMessage",addMessage)

module.exports=messageRouter
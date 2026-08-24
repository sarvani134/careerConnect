const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") })
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]); 
const {storage}=require("./cloudConfig")

const cors=require("cors");
const  postRouter  = require("./routes/postRoutes/postRoute");
const app=express()
const userRouter=require("./routes/userRoutes/userRoute")
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use("/users",userRouter)

const messageRouter = require("./routes/messageRoutes/messageRoute");

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
})
.catch((err)=>{
    console.log(err)
})

app.use("/posts",postRouter)
app.use("/messages",messageRouter)

const port = process.env.PORT || 3000
app.listen(port, "0.0.0.0", ()=>{
    console.log(`connected to port ${port}`)
})

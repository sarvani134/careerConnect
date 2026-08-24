const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
dotenv.config()
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
app.get("/", (req, res) => {
    res.send("BusinessConnect API is running");
});

const path = require("path");
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
app.listen(3000,()=>{
    console.log("connected to port 3000")
})

const express=require("express")
const userRouter=express.Router()
const {getHomePage, getUserId, logout, displayProfile, createProfile, getUserById, getConnectionsAccepted} = require("../../controllers/userControllers/userController")
const {register,login,updateProfilePicture,updateUserInfo,getUserAndProfile,getPDF,sendConnectionRequest,getConnectionsSent,getConnectionsReceived,acceptConnectionRequest,updateProfile}=require("../../controllers/userControllers/userController")
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const PDFDocument = require('pdfkit');
const multer=require("multer")
const { storage } = require("../../cloudConfig");

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true)
    cb(new Error("Only image files are allowed"), false)
  }
})

userRouter.get("/",(req,res)=>{
    res.send("welcome to user homepage")
})
userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/logout",logout)
userRouter.post("/updateProfilePicture",upload.single("profilePicture"),updateProfilePicture)
userRouter.post("/updateUserInfo",updateUserInfo)
userRouter.get("/getPDF/:userId", getPDF);
userRouter.get("/getUserAndProfile",getUserAndProfile)
userRouter.post("/updateProfileData",updateProfile)
userRouter.post("/sendConnectionRequest",sendConnectionRequest)
userRouter.post("/getConnectionsSent",getConnectionsSent)
userRouter.get("/getConnectionsReceived",getConnectionsReceived)
userRouter.post("/acceptConnectionRequest",acceptConnectionRequest)
userRouter.get("/getUserId",getUserId)

userRouter.get("/getConnectionsAccepted",getConnectionsAccepted)
userRouter.post("/displayProfile",displayProfile)
userRouter.post("/createProfile",createProfile)

userRouter.get("/getUserById",getUserById)


module.exports = userRouter;


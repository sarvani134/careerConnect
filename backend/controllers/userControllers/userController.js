const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const {Profile, Education, Company}= require("../../models/profileModel");
const crypto=require("crypto");
const { profile } = require("console");
const PDFDocument = require('pdfkit');
const express=require("express")
const app=express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const convertUserDataIntoPdf = require("./pdfDownloader");
const Connection  = require("../../models/connectionModel");
const { connections } = require("mongoose");
const Post = require("../../models/postModel");

const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        await Profile.create({
            userId: newUser._id,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
const getUserId=async(req,res)=>{
 
  let {token}=req.query
  let user=await User.findOne({token})
  if(user==null){
    return res.json({userId:null})
  }
  return res.json({userId:user._id})
}
const getUserById=async(req,res)=>{
    try{
        let {userId}=req.query
        let user=await User.findOne({_id:userId})
        res.json({user})

    }
    catch(err){
        return res.json({err:err})
    }
}
const login=async(req,res)=>{
  try{

    let {email,password}=req.body
    let user=await User.findOne({email})
    if(!user){
      return res.status(401).json({ message: "Invalid email or password" })
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
      return res.status(401).json({ message: "Invalid email or password" })
    }
    const token=crypto.randomBytes(32).toString("hex")
   
    user.token=token

    await user.save()

   res.json({
    message: "logged in success",
    token: token
});

  }
  catch(err){
    console.log(err)
  }

}
const logout=async(req,res)=>{
  try{
    let {token}=req.body
    if(token==null){
      return res.status(400).json({msg:"user is not logged in"})
    }
    let user=await User.findOne({token})
    if(!user)
    {
       return res.status(400).json({msg:"user is not found"})
    }

    user.token=null
    await user.save()
     return res.status(200).json({msg:"user has successfully logged out"})
  }
  catch(err){
    console.log(err)
  }
}
const updateProfilePicture=async(req,res)=>{

try{
    let {token}=req.body
    let user=await User.findOne({token:token})
    if(!user){
      return res.send("no user found")
    }
    if (!req.file) {
      return res.status(400).send("Please select an image")
    }
    user.profilePicture={
      url: req.file.path,
      filename: req.file.filename
    }
    await user.save();
    
    res.send("profile picture updated")

}
catch(err){
  console.log(err)
}
  

}
const updateUserInfo=async(req,res)=>{
  try{
    let {token,...newUserData}=req.body
  let user=await User.findOne({token:token})
  if(!user){
    return res.send("user not found")
  }
  let {email,password}=newUserData
  let existingUser=await User.findOne({email:email})
  if(existingUser){
    return res.send("User already exists")
  }
  Object.assign(user,newUserData)
  await user.save()
  res.send("User saved successfully")
  }
  catch(err){
    console.log(err)
  }

}
const getUserAndProfile=async(req,res)=>{
  try{
     let {token}=req.body
    let user=await User.findOne({token:token})
    let {_id}=user
    if(!user){
      return res.send("no user found")
    }
    
    let userProfile=await Profile.findOne({userId:_id})
    .populate('userId','name email username profilePicture')
    
   return res.json(userProfile)


  }
  catch(err){
    console.log(err)
  }
}

const updateProfileData=async(req,res)=>{
   try{
     let {token,...newProfileData}=req.body
    let user=await User.findOne({token:token})
    let {_id}=user
    if(!user){
      return res.send("no user found")
    }
   let profileData=await Profile.findOne({userId:user._id})
 if(!profileData){
  return res.send("no profile data is found")
 }
   Object.assign(profileData,newProfileData)
   await profileData.save()
   res.json(profileData)
   


  }
  catch(err){
    console.log(err)
  }

}
const getPDF = async (req, res) => {

    try {

      const userID = req.params.userId;
        

        const data = await Profile.findOne({ userId: userID })
            .populate("userId", "name email username profilePicture")
            .populate("education")
            .populate("pastWork");

        if (!data) {
            return res.send("User not found");
        }

        const pdfPath = await convertUserDataIntoPdf(data);
        


        res.download("uploads/" + pdfPath);

    } catch (err) {
        console.log(err);
    }

};
const sendConnectionRequest = async (req, res) => {
    try {
        const { token, connectionId } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                msg: "User not found"
            });
        }

        // Check if user is trying to connect with themselves
        if (user._id.toString() === connectionId.toString()) {
            return res.status(400).json({
                msg: "You cannot connect with yourself"
            });
        }

        // Check whether target user exists
        const currRequest = await User.findById(connectionId);

        if (!currRequest) {
            return res.status(404).json({
                msg: "User doesn't exist"
            });
        }

        // Check whether request already exists
        const existingRequest = await Connection.findOne({
            userId: user._id,
            connectionId: connectionId
        });

        if (existingRequest) {
            return res.status(400).json({
                msg: "You have already sent a request"
            });
        }

        // Create connection request
        const newConnectionRequest = new Connection({
            userId: user._id,
            connectionId: connectionId
        });

        await newConnectionRequest.save();

        return res.status(201).json({
            msg: "connection sent successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};
const getConnectionsSent = async (req, res) => {
    try {
        const {token,status,requestId} = req.body;


        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                msg: "No user found"
            });
        }

        if(status==="withdraw"){

            let deletedConnection=await Connection.findOneAndDelete({
                _id:requestId,
                userId:user._id,
                status_accepted:false
            })

            if (!deletedConnection) {
                return res.status(404).json({
                    msg: "Connection request not found"
                });
            }
        }
        
            const connectionsSent = await Connection.find({
            userId: user._id,
            status_accepted:false
        }).populate(
            "connectionId",
            "username name email profilePicture"
        );
        

        return res.status(200).json(connectionsSent);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Internal server error"
        });
    }
};
const displayProfile = async (req, res) => {
    try {

        const { token } = req.body;

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                msg: "No user found"
            });
        }

        const posts = await Post.find({
            userId: user._id
        });

        const profile = await Profile.findOne({
            userId: user._id
        })
        .populate("education")
        .populate("pastWork");

        return res.json({
            user,
            posts,
            profile
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            msg: "Error displaying profile",
            error: err.message
        });
    }
};
const createProfile = async (req, res) => {
    try {
        const {
            token,
            bio,
            currentPost,
            company,
            position,
            years,
            school,
            degree,
            fieldOfStudy
        } = req.body;

        // Find the user using token
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        // Create Education
        const education = await Education.create({
            school,
            degree,
            fieldOfStudy
        });

        // Create Company
        const companyData = await Company.create({
            company,
            position,
            years
        });

        // Create Profile
        const profile = await Profile.create({
            userId: user._id,
            bio,
            currPost: currentPost,
            education: [education._id],
            pastWork: [companyData._id]
        });

        return res.status(201).json({
            msg: "Profile created successfully",
            profile
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Error creating profile",
            error: err.message
        });
    }
};
const updateProfile = async (req, res) => {
    try {
        const {
            token,
            bio,
            currentPost,
            company,
            position,
            years,
            school,
            degree,
            fieldOfStudy
        } = req.body;

        // Find user
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        // Find existing profile
        const profile = await Profile.findOne({
            userId: user._id
        });

        if (!profile) {
            return res.status(404).json({
                msg: "Profile not found"
            });
        }

        // Only update fields submitted by the section currently being edited.
        if (typeof bio === "string") profile.bio = bio;
        if (typeof currentPost === "string") profile.currPost = currentPost;

        const hasEducationUpdate = [school, degree, fieldOfStudy]
            .some((value) => typeof value === "string");
        if (hasEducationUpdate && profile.education.length > 0) {

            await Education.findByIdAndUpdate(
                profile.education[0],
                {
                    school,
                    degree,
                    fieldOfStudy
                },
                { new: true }
            );

        } else if (hasEducationUpdate) {

            const education = await Education.create({
                school,
                degree,
                fieldOfStudy
            });

            profile.education.push(education._id);
        }

        const hasExperienceUpdate = [company, position, years]
            .some((value) => typeof value === "string");
        if (hasExperienceUpdate && profile.pastWork.length > 0) {

            await Company.findByIdAndUpdate(
                profile.pastWork[0],
                {
                    company,
                    position,
                    years
                },
                { new: true }
            );

        } else if (hasExperienceUpdate) {

            const companyData = await Company.create({
                company,
                position,
                years
            });

            profile.pastWork.push(companyData._id);
        }

        await profile.save();

        return res.status(200).json({
            msg: "Profile updated successfully",
            profile
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            msg: "Error updating profile",
            error: err.message
        });
    }
};
const getConnectionsReceived=async(req,res)=>{

  try{
    const token=req.query.token
     let user=await User.findOne({token})
  
    if(!user){
      return res.send("no user found")
    }

    let connectionUsers=await Connection.find({connectionId:user._id,status_accepted:false})
    .populate("userId",'username name email  profilePicture ')


    if(connectionUsers.length==0){
      return res.json([])
    }
      res.json({connectionUsers})

  }
  catch(err){
    console.log(err)
  }
}
const acceptConnectionRequest=async(req,res)=>{
  
  try{
    let {token,requestId,status}=req.body
     let user=await User.findOne({token})
  
    if(!user){
      return res.send("no user found")
    }

    let connectionUser=await Connection.findById(requestId)
    if(!connectionUser){
      return res.send(" Request sent user doesnt exist ")
    }
    if(status==="accept"){
      connectionUser.status_accepted=true;
      await connectionUser.save()
      return res.json({connectionUser})
    }

    if(status==="ignore"){
      await Connection.findByIdAndDelete(requestId)
      return res.json({msg:"Connection request ignored"})
    }

    return res.status(400).json({
      msg: "Invalid connection request status"
    })
  }
  catch(err){
    console.log(err)
    return res.status(500).json({
      msg: "Unable to update connection request"
    })
  }
}

const getConnectionsAccepted = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({
        err: "user not found"
      });
    }

    const connections = await Connection.find({
      connectionId: user._id,
      status_accepted: true
    }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json({ connections });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      err: "Internal server error"
    });
  }
};
module.exports={getConnectionsAccepted,getUserById,updateProfile,createProfile,displayProfile,logout,getUserId,register,login,updateProfilePicture,updateUserInfo,getUserAndProfile,updateProfileData,getPDF,sendConnectionRequest,getConnectionsSent,getConnectionsReceived,acceptConnectionRequest}

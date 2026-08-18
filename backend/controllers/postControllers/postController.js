const User = require("../../models/userModel")
const Post=require("../../models/postModel")
const Comment=require("../../models/commentModel")

const getHomePage=(req,res)=>{
    res.send("welcome to post home page")
}
const createPost=async(req,res)=>{
    try{
        const {token}=req.body
        const user=await User.findOne({token})
        if(!user){
            return res.json({err:"user not found"})
        }
        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media: req.file ? {
                url: req.file.path,
                filename: req.file.filename
            } : undefined,
            fileType:req.file!=undefined?req.file.mimetype.split("/")[1]:"",

        })
        await post.save()
        res.json({post:post})

    }
    catch(err){
        console.log(err)
        return res.status(500).send(err)
    }

}
const allPosts=async(req,res)=>{
     try{
        const user = req.query.token
            ? await User.findOne({ token: req.query.token })
            : null;
        const posts=await Post.find().populate("userId","username name email  profilePicture ")
        if(posts.length==0){
            return res.send("no posts are created")
        }

        const postsWithLikeState = posts.map((post) => ({
            ...post.toObject(),
            likedByCurrentUser: user
                ? (post.likedBy || []).some((likedUserId) => likedUserId.equals(user._id))
                : false,
        }));

        res.json({posts:postsWithLikeState})   
    }
    catch(err){
        console.log(err)
        return res.status(500).send(err)
    }

}

const deletePost=async(req,res)=>{
    try{

        const {token,postId}=req.body

        const user=await User.findOne({token})
        if(!user){
            return res.send("user not found")
        }
        const post=await Post.findOne({_id:postId}).populate("userId","username name email  profilePicture ")
        if (user._id.toString() !== post.userId._id.toString()){
            return res.send("you are not the owner of this post")

        }
       
        await Post.deleteOne({_id:postId})


        return res.send("Post has been deleted")

    }
    catch(err){
        res.status(500).send(err)
    }
}
const editPost=async(req,res)=>{
    try{
        let {token,body,postId}=req.body
        let user=await User.findOne({token})
        if(!user){
            return res.status(400).send("user not found")
        }
        let post=await Post.findOne({_id:postId})
        if(!post){
            return res.status(400).send("post not found")
        }
        if(post.userId.toString()!==user._id.toString()){
            return res.send("You are not the owner of the post")

        }
        post.body=body
          post.updatedAt = new Date();
        await post.save()

        return res.json({post:post})

    }
    catch(err){
        console.log(err)

    }
}
const commentPost=async(req,res)=>{
      try{

        const {token,postId,commentBody}=req.body
        let user=await User.findOne({token})
        if(!user){
            return res.status(401).json({msg:"user does not exist"})
        }
        let post=await Post.findOne({_id:postId})
       
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }

        if(!commentBody || !commentBody.trim()){
            return res.status(400).json({msg:"comment cannot be empty"})
        }

        let comment=await Comment.create({
            userId:user._id,
            postId:post._id,
            body:commentBody.trim()
        })
      

        return res.status(201).json({msg:"comment created successfully", comment})

       

    }
    catch(err){
        res.status(500).send(err)
    }

}
const getAllComments=async(req,res)=>{
    try{
        const {postId}=req.query
        let comments=await Comment.find({postId}).sort({_id: -1}).populate("userId","name username profilePicture")
        return res.json({comments})

    }
    catch(err){
        res.status(500).json({msg:"Could not load comments"})

    }

}
const deleteComment=async(req,res)=>{
    try{
        let {token,commentId}=req.body
        let user=await User.findOne({token})
        let comment=await Comment.findOne({_id:commentId})
        if(!comment){
            return res.send("no comment")
        }
        if(comment.userId.toString()!=user._id.toString()){
            return res.send("Unauthorized access")
        }
        await Comment.deleteOne({_id:comment._id})
        return res.send("comment has been deleted")

    }
    catch(err){
        console.log(err)
    }
}
const incrementLikes=async(req,res)=>{
    try{
        let {postId, token}=req.body

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({msg:"Please log in to like a post"})
        }

        let post=await Post.findOne({_id:postId})
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }

        // Older posts may not yet have a likedBy array.
        if (!post.likedBy) {
            post.likedBy = [];
        }

        const alreadyLiked = post.likedBy.some((likedUserId) =>
            likedUserId.equals(user._id)
        );

        if (alreadyLiked) {
            post.likedBy.pull(user._id);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            post.likedBy.addToSet(user._id);
            post.likes += 1;
        }

        await post.save()
        return res.json({
            likesCount:post.likes,
            likedByCurrentUser:!alreadyLiked
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({msg:"Unable to update like"})
    }
}
module.exports = {editPost,getHomePage,createPost,allPosts,deletePost,commentPost,getAllComments,deleteComment,incrementLikes};

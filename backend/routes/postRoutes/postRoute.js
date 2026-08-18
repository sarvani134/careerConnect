const express = require("express");
const postRouter = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudConfig");

const {
    getHomePage,
    createPost,
    allPosts,
    deletePost,
    commentPost,
    getAllComments,
    deleteComment,
    incrementLikes,
    editPost,
} = require("../../controllers/postControllers/postController");

const upload = multer({
    storage: storage,

    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "video/mp4",
            "video/mov",
            "video/quicktime",
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Unsupported file type"), false);
        }
    },
});

postRouter.get("/", getHomePage);

postRouter.post(
    "/createPost",
    upload.single("media"),
    createPost
);

postRouter.get("/allPosts", allPosts);

postRouter.post("/deletePost", deletePost);
postRouter.post("/editPost",editPost)

postRouter.post("/commentPost", commentPost);

postRouter.get("/getAllComments", getAllComments);

postRouter.post("/deleteComment", deleteComment);

postRouter.post("/incrementLikes", incrementLikes);


module.exports = postRouter;

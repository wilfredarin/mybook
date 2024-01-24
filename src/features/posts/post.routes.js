import express from "express";
import { createPost,deletePost,getPost,getEditPostById,toggleLikePost,updatePost,
getCreatePost } from "./post.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";
import { uploadFile } from "../../middlewares/file-upload.middleware.js";

const router = express.Router();

router.route("/create-post").post(uploadFile.single("imageUrl"),createPost);
router.route("/").get(getPost);
router.route("/update/:id").get(getEditPostById);
router.route("/toggle-like/:id").post(toggleLikePost);
// if using multer it's must other wise req.body will be empty!
router.route("/update/:id").post(uploadFile.single("imageUrl"),updatePost);
router.route("/delete/:id").post(deletePost);

router.route("/create-post").get(getCreatePost);
export default router;

//needs testing of update-post route  

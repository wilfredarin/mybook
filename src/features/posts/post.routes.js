import express from "express";
import { createPost,deletePost,getPost,getPostById,toggleLikePost,updatePost,
getCreatePost } from "./post.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.route("/create-post").post(auth,createPost);
router.route("/").get(getPost);
router.route("/post/:id").get(getPostById);
router.route("/toggle-like/:id").post(auth,toggleLikePost);
router.route("/update-post/:id").put(auth,updatePost);
router.route("/delete-post/:id").delete(auth,deletePost);

router.route("/create-post").get(auth,getCreatePost);
export default router;

//needs testing of update-post route  

  import { createPostRepo,getPostRepo,getPostByIdRepo,
    toggleLikePostRepo,deletePostRepo,updatePostRepo } from "./post.repository.js";
  import { customErrorHandler } from "../../middlewares/errorHandler.js";
import fs from "fs";
import path from "path";

  
  export const createPost = async (req, res, next) => {
    console.log(req.body,"sss")
    let content = req.body.content;
    let title = req.body.title;
    let privacy = req.body.privacy;
    const creator = req._id;
    const userId = req._id;
    let photo= null;
    if(req.file){
      photo=fs.readFileSync(path.resolve("public","images",req.file.filename))
    }
    // let imageUrl = null;
    
    // if(req.file){
    //   imageUrl = "images/"+req.file.filename;
    // }
    
    const resp = await createPostRepo({ title,content,photo,privacy,creator },userId);
    if (resp.success) {
      return res.redirect("/posts/");
    } else {
      res.render("post-feeds",{error:resp.error.msg,userName:req.username});
      // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };

export const getPost = async (req,res,next) =>{
    const userId = req._id;
    const resp = await getPostRepo(userId);
    if (resp.success) {
        res.render("post-feeds",{
          userName:req.username,
          posts: resp.res,
          error:null,
          userId:req._id
        });
      } else {
        res.render("post-feeds",{error:resp.error.msg,userName:req.username});
        // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
}
export const getEditPostById = async (req,res,next) =>{
    const postId = req.params.id;
    const resp = await getPostByIdRepo(postId);
    if (resp.success) {
        res.render("post-update",{post:resp.res,error:null,userName:req.username})
      } else {
        res.render("post-feeds",{error:resp.error.msg,userName:req.username});
        // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
}

export const toggleLikePost = async(req,res,next) =>{
    const id = req.params.id;
    const userId = req._id;
    const resp = await toggleLikePostRepo(id,userId);
    if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "fetched Posts successfully",
          res: resp.res,
        });
      } else {
        res.render("post-feeds",{error:resp.error.msg,userName:req.username});
        // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
}

export const deletePost = async(req,res,next)=>{
  //when post deletes delte the images as well later
  const id = req.params.id;
  const userId = req._id;
  const resp = await deletePostRepo(id,userId);
  if (resp.success) {
      res.redirect("/posts");
    } else {
      res.render("post-feeds",{error:resp.error.msg,userName:req.username});
      // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
}

export const updatePost = async(req,res,next)=>{
  const postId = req.params.id;
  const userId = req._id;
  
  const {title,content,privacy} = req.body;
  let imageUrl = null;
  if(req.file){
      imageUrl = "images/"+req.file.filename;
  }
  const resp = await updatePostRepo(postId,userId,{title,content,imageUrl,privacy});
  if (resp.success) {
      res.redirect("/posts");
    } else {
      res.render("post-feeds",{error:resp.error.msg,userName:req.username});
      // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
}

export const getCreatePost = (req,res,next)=>{
  res.render("post-add",{userName:req.username,
    error:null,
    userId:req._id});
}
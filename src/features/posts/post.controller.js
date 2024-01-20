  import { createPostRepo,getPostRepo,getPostByIdRepo,
    toggleLikePostRepo,deletePostRepo,updatePostRepo } from "./post.repository.js";
  import { customErrorHandler } from "../../middlewares/errorHandler.js";


  
  export const createPost = async (req, res, next) => {
    let { title,content } = req.body;
    const creator = req._id;
    const userId = req._id;
    let imageUrl=null;
    if(imageUrl){
      imageUrl = "images/"+req.file.filename;
    }
    const resp = await createPostRepo({ ...req.body,imageUrl, creator },userId);
    if (resp.success) {
      return res.redirect("/posts/");
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };

export const getPost = async (req,res,next) =>{
    const resp = await getPostRepo();
    if (resp.success) {
        res.render("post-feeds",{userName:req.username,posts: resp.res,error:null});
      } else {
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
}
export const getPostById = async (req,res,next) =>{
    const id = req.params.id;
    const resp = await getPostByIdRepo(id);
    if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "fetched Posts successfully",
          res: resp.res,
        });
      } else {
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
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
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
}

export const deletePost = async(req,res,next)=>{
  const id = req.params.id;
  const userId = req._id;
  const resp = await deletePostRepo(id,userId);
  if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "Post deleted successfully",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
}

export const updatePost = async(req,res,next)=>{
  const id = req.params.id;
  const userId = req._id;
  const {title,content,imageUrl} = req.body;
  const details = {title:title,content:content,imageUrl:imageUrl};
  const resp = await updatePostRepo(id,userId,details);
  if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "Post updated successfully",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
}

export const getCreatePost = (req,res,next)=>{
  res.render("post-add",{userName:req.username,error:null});
}
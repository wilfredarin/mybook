import mongoose from "mongoose";
import { userSchema } from "../user/user.schema.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import { postSchema } from "./post.schema.js";
import { ObjectId } from "mongodb";
const UserModel = mongoose.model("User", userSchema);
const PostModel = mongoose.model("Post",postSchema);
export const createPostRepo = async (userData,userId) => {
  try {
    const newPost = new PostModel(userData);      
    await newPost.save();
    const user =  await UserModel.findById(userId);
    user.posts.push(newPost._id);
    await user.save();
    return { success: true, res: newPost};
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const getPostRepo =  async ()=> {
    try {
        const posts = await PostModel.find()
                      .populate('creator').populate({
                        path:"comments",
                        populate:{path:"creator"}
                      });
                    // 'name' is the field you want to retrieve from the referenced User schema
        return { success: true, res: posts};
      } catch (error) {
        return { success: false, error: { statusCode: 400, msg: error } };
      }
}

export const getPostByIdRepo = async (id)=>{
    try {
        const post = await PostModel.findById(id);
        return { success: true, res: post};
      } catch (error) {
        return { success: false, error: { statusCode: 400, msg: error } };
      }
}

export const toggleLikePostRepo = async(id,userId)=>{
    try {
      const post = await PostModel.findById(id);
      const _id = new ObjectId(userId);
      const isLiked = post.likes.includes(userId);
      if(isLiked){
        post.likes.splice(post.likes.indexOf(_id),1);
      }else{
        post.likes.push(_id);
      }
      await post.save();
      return { success: true, res: post};
    } catch (error) {
      return { success: false, error: { statusCode: 400, msg: error } };
    }
}

export const deletePostRepo = async(postId,userId)=>{
  try {
    const post = await PostModel.findById(postId);
    const _id = new ObjectId(userId);
    postId = new ObjectId(postId);
    if(post && String(post.creator)==String(_id)){
      await PostModel.deleteOne({
        _id:postId
      });
      return { success: true, res: "post deleted!"};
    }else{
      return { success: false, error: { statusCode: 400, msg: "unauthorized action!" } };
    }
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
}

export const updatePostRepo  = async(postId,userId,data)=>{
  try {
    const post = await PostModel.findById(postId);
    const _id = new ObjectId(userId);
    postId = new ObjectId(postId);
    if(post && String(post.creator)==String(_id)){
      //add logic here 
      if(data.title){
        post.title=data.title;
      }
      if(data.content){
        post.content = data.content;
      }
      if(data.imageUrl){
        post.imageUrl =  data.imageUrl;
      }
      await post.save();
      return { success: true, res: post};
    }else{
      return { success: false, error: { statusCode: 400, msg: "unauthorized action!" } };
    }
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
}
import mongoose from "mongoose";
import { userSchema } from "../user/user.schema.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import { postSchema } from "./post.schema.js";
import { ObjectId } from "mongodb";
import { commentSchema } from "../comments/comment.schema.js";
const UserModel = mongoose.model("User", userSchema);
const PostModel = mongoose.model("Post",postSchema);
const CommentModel = mongoose.model("Comment",commentSchema)
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

export const getPostRepo =  async (userId)=> {
    try {
        const user = await UserModel.findById(userId);
        const rawPosts = await PostModel.find()
                      .populate('creator').populate({
                        path:"comments",
                        populate:{path:"creator"}
                      });
                    // 'name' is the field you want to retrieve from the referenced User schema
        let posts = [];

        rawPosts.forEach(post=>{
          if(post.privacy=="public"){
            posts.push(post);
          }else if(post.privacy=="friends-only"){
            if(user.friendList.includes(post.creator._id)||userId==post.creator._id ){
              posts.push(post);
            }
          }else if(post.privacy=="private"){
            if(userId==post.creator._id){
              posts.push(post);
            }
          }
        });

        posts.reverse();
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
      let msg="";
      if(isLiked){
        post.likes.splice(post.likes.indexOf(_id),1);
        msg = "unliked"
      }else{
        post.likes.push(_id);
        msg="liked"
      }
      await post.save();
      return { success: true, res: msg};
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
      //delete all the comments associated with it 
      await CommentModel.deleteMany({post:postId});
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
      if(data.photo){
        post.photo =  data.photo;
      }
      post.privacy = data.privacy;
      await post.save();
      return { success: true, res: post};
    }else{
      return { success: false, error: { statusCode: 400, msg: "unauthorized action!" } };
    }
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
}
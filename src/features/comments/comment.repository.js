import mongoose from "mongoose";
import { commentSchema } from "../comments/comment.schema.js";
import { postSchema } from "../posts/post.schema.js";

const CommentModel = mongoose.model("Comment", commentSchema);
const PostModel = mongoose.model("Post", postSchema);
export const createCommentRepo = async(comment,userId,postId)=>{
    try{
        
        const post = await PostModel.findById(postId);
        if(!post){
            return { success: false, error: { statusCode: 400, msg: "Invalid post" } };
        }
        const newComment = new CommentModel({content:comment,creator:userId,post:postId});
        await newComment.save();
        post.comments.push(newComment);
        post.save();
        return { success: true, res:newComment }
    } catch (error) {
        return { success: false, error: { statusCode: 400, msg: error } };
    }
}
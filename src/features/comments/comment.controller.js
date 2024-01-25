import { createCommentRepo,deleteCommentRepo } from "./comment.repository.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

export const createComment = async (req, res, next) => {
    let { comment } = req.body;
    let userId = req._id;
    let postId = req.params.id;
    const resp = await createCommentRepo(comment,userId,postId);
    if (resp.success) {
      return res.redirect("/posts/");
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };

  export const deleteComment = async(req, res, next) => {
    const commentId = req.params.id;
    const userId = req._id;
    const resp = await deleteCommentRepo(commentId,userId);
    //weak error handeling change it later
    if(!resp){
      console.log(resp);
    }
    return res.redirect("/posts/");
  }
  
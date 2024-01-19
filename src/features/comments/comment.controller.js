import { createCommentRepo } from "./comment.repository.js";
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
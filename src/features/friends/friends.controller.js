import { sendFriendRequestRepo,
  acceptRequestRepo,getOtherUsersRepo,
  getFriendRequestsRepo,removeFriendRepo,rejectRequestRepo } from "./friends.repository.js";
  import { customErrorHandler } from "../../middlewares/errorHandler.js";
  
  export const sendFriendRequest = async (req, res, next) => {
    let friendId = req.params.id;
    const userId = req._id;
    if(userId==friendId){
        return res.send("You already are a good friend of yourself!")
    }
    const resp = await sendFriendRequestRepo(userId,friendId);
    if (resp.success) {
      res.redirect("/friends/find-new-friend");
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };

  export const acceptRequest = async(req,res,next)=>{
    let friendId = req.params.id;
    const userId = req._id;
    const resp = await acceptRequestRepo(userId,friendId);
      if (resp.success) {
        res.redirect("/friends/find-new-friend");
      } else {
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      }
  }

  export const getOtherUsers = async(req,res,next)=>{
    const userId = req._id;
    const resp = await getOtherUsersRepo(userId);
    if (resp.success) {
      res.render("friends/user-list",{
        userName:req.username,
        error:null,
        otherUsers:resp.res.userList,
        userData:resp.res.user
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }

  export const getFriendRequests = async(req,res,next)=>{
    const userId = req._id;
    const resp = await getFriendRequestsRepo(userId);
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "List of other Users fetched successfully.",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }

  export const rejectRequest = async(req,res,next)=>{
    const userId = req._id;
    const friendRequestId = req.params.id;
    const resp = await rejectRequestRepo(userId,friendRequestId);
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "Friend request rejected successfully.",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }

  export const removeFriend = async(req,res,next)=>{
    const userId = req._id;
    const friendId = req.params.id;
    const resp = await removeFriendRepo(userId,friendId);
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "friend removed successfully",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }
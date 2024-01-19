import mongoose from "mongoose";
import { userSchema } from "../user/user.schema.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import { ObjectId } from "mongodb";
const UserModel = mongoose.model("User", userSchema);


export const sendFriendRequestRepo = async (userId,friendId) => {
  try {
    userId = new ObjectId(userId);
    friendId = new ObjectId(friendId);
    const friend = await UserModel.findById(friendId);
    if(!friend.friendList.includes(userId) && !friend.friendRequests.includes(userId)){
        friend.friendRequests.push(userId);
        await friend.save()
    }
    return { success: true, res: "Request Sent"};
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const acceptRequestRepo= async (userId,friendId) => {
    try {
      userId = new ObjectId(userId);
      friendId = new ObjectId(friendId);
      const user = await UserModel.findById(userId);
      if(user.friendRequests.includes(friendId)){
          const requestInd = user.friendRequests.indexOf(friendId);
          user.friendRequests.splice(requestInd,1);
          user.friendList.push(friendId);
          await user.save()
          return { success: true, res: user};
      }
      return { success: false, error: { statusCode: 400, msg: "Friend Request not found" }};
    } catch (error) {
      return { success: false, error: { statusCode: 400, msg: error } };
    }
  };

  export const getOtherUsersRepo = async (userId)=>{
    try{
      const user = await UserModel.findById(userId);
      const userList = await UserModel.find();
      const userInd = userList.indexOf(user);
      userList.splice(userInd,1);
      return { success: true, res: userList};
    }catch(error){
      return { success: false, error: { statusCode: 400, msg: error }}
    }
  }

  export const  getFriendRequestsRepo = async(userId)=>{
      try{
        const user = await UserModel.findById(userId);
        const friendRequests = user.friendRequests;
        if(friendRequests.length){
          return { success: true, res: friendRequests};
        }else{
          return { success: false, error: { statusCode: 400, msg: "No Request" }}
        }
    }catch(error){
      return { success: false, error: { statusCode: 400, msg: error }}
    }
  }

  export const rejectRequestRepo = async(userId,friendRequestId)=>{
    try{
      friendRequestId = new ObjectId(friendRequestId);
      const user = await UserModel.findById(userId);
      const friendRequests = user.friendRequests;
      console.log("check requests",friendRequests.includes(friendRequestId));
      if(friendRequests.length && friendRequests.includes(friendRequestId)){
        const requestInd = friendRequests.indexOf(friendRequestId);
        friendRequests.splice(requestInd,1);
        user.save();
        return { success: true, res: friendRequests};
      }else{
        return { success: false, error: { statusCode: 400, msg: "No such Request found" }}
      }
    }catch(error){
      return { success: false, error: { statusCode: 400, msg: error }}
    }
  }

  export const removeFriendRepo = async(userId,friendId)=>{
    try{
      friendId = new ObjectId(friendId);
      const user = await UserModel.findById(userId);
      const friendList = user.friendList;
      if(friendList.length && friendList.includes(friendId)){
        const friendInd = friendList.indexOf(friendId);
        friendList.splice(friendInd,1);
        user.save();
        return { success: true, res: user};
      }else{
        return { success: false, error: { statusCode: 400, msg: "No such friend found!" }}
      }
    }catch(error){
      return { success: false, error: { statusCode: 400, msg: error }}
    }
  }
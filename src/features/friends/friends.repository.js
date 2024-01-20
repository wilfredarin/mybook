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
    const user = await UserModel.findById(userId);
    if(!friend.friendList.includes(userId) && !friend.friendRequestsReceived.includes(userId)){
        friend.friendRequestsReceived.push(userId);
        user.friendRequestsSent.push(friendId);
        await user.save();
        await friend.save();
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
      const friend = await UserModel.findById(friendId);
      if(user.friendRequestsReceived.includes(friendId)){
          const requestInd = user.friendRequestsReceived.indexOf(friendId);
          user.friendRequestsReceived.splice(requestInd,1);
          user.friendList.push(friendId);
          
          const friendRequestInd = friend.friendRequestsSent.indexOf(userId);
          friend.friendRequestsSent.splice(friendRequestInd,1);
          friend.friendList.push(userId);
          await user.save();
          await friend.save();
          //delete the sent request item of frnd
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
      let userList = await UserModel.find();
      const userInd = userList.indexOf(user);
      //if user in user's frnd list don't show here! - implement later
      return { success: true, res: {userList:userList,user:user}};
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
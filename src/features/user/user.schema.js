import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minLength: [3, "The name should be at least 3 characters long"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
    match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
  },
  mobile: {
    type: String,
    unique: true,
    required: [true, "mobile number is reuired"],
  },
  profilePic:String,
  gender:{type:String,required:true,enum:["male","female","other","private"]},
  password: { type: String, required: [true, "password is required"] },
  friendList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  friendRequestsSent:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  friendRequestsReceived:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
  }],
  photo:{
    data: Buffer,
    contentType: String,
},
  
});

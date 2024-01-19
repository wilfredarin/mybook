import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
    content:{type:String,required:true},
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    time:{type:Date,default:Date.now()},
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
})


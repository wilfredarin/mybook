import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    title:{type:String,requried:true},
    content:{type:String,required:true},
    photo:{
        type:Buffer
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    time:{
        type:Date,default:Date.now(),
        required:true
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    privacy:{
        type:String,
        required:true,
        enum:["private","public","friends-only"]
    }
    

}).pre("deleteOne",async function(next){
    console.log("deleted! post");
    next();
});
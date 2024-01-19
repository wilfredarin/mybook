import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    title:{type:String,requried:true},
    content:{type:String,required:true},
    imageUrl:{type:String},
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
    }]

});
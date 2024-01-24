//have it on top before everything loads
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
//routers
import userRouter from "./src/features/user/user.routes.js";
import commentRouter from "./src/features/comments/comment.routes.js";
import postRouter from "./src/features/posts/post.routes.js";
import freindRouter from "./src/features/friends/friends.routes.js";

import { auth } from './src/middlewares/jwtAuth.js';
import ejsLayouts from "express-ejs-layouts"
import path from "path";
import jwt from "jsonwebtoken";
import { customErrorHandler } from './src/middlewares/errorHandler.js';
const app = express();



//views
app.set("view engine","ejs");
app.set("views",path.join(path.resolve(),"src","views"));
app.use(ejsLayouts);

app.use(express.json());
//parse form data  -without we'll not get the form data
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req,res)=>{
    //check if loged in 
  
    const { jwtToken } = req.cookies;
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.render("index",{userName:null,error:null});
    } else {
      req._id = data._id;
      req.username = data.user.name;
      return res.render("index",{userName:req.username,error:null});
    }
  });
})
app.use("/user", userRouter);
app.use("/posts",auth, postRouter);
app.use("/comments", commentRouter);
app.use("/friends", auth,freindRouter);




//application level error handeling at the end !
app.use((err,req,res,next)=>{
  console.log(err);
  //just for the purpose of learning used if and else - otherwise it is redundant
  if(err instanceof customErrorHandler){
    res.render("index",{error:err,userName:req.username});
  }else{
    res.render("index",{error:err,userName:req.username});
}
});
export default app;
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
    res.render("index",{userName:req.userName,error:null});
})
app.use("/user", userRouter);
app.use("/posts",auth, postRouter);
app.use("/comments", commentRouter);
app.use("/friends", auth,freindRouter);


export default app;
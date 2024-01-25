import {
    updateUserPasswordRepo,
    userLoginRepo,
    userRegisterationRepo,
    updateProfileRepo,
    getUserPostsByIdRepo
  } from "./user.repository.js";
  import jwt from "jsonwebtoken";
  import bcrypt from "bcrypt";
  import { customErrorHandler } from "../../middlewares/errorHandler.js";
 import path from "path";
import fs from "fs";

  export const userRegisteration = async (req, res, next) => {
    let { password } = req.body;
    password = await bcrypt.hash(password, 12);
    let photo= null;
    if(req.file){
      photo = {
        data:req.file.buffer,
        contentType: req.file.mimetype
      }
    }else{
      photo={
        data: fs.readFileSync(path.resolve('public', "images", "avatar.jpg")),
        contentType:"image/jpeg"
      }
    }
    // if(req.file){
    //   photo=fs.readFileSync(path.resolve("public","images",req.file.filename))
    // }
    
    
    //make it mandagtory for imageuplaod - otherwise code will break
    const resp = await userRegisterationRepo({ ...req.body, photo,password });
    if (resp.success) {
      res.render("user-login",{userName:req.userName,error:null});
    } else {
      res.render("user-register",{error:resp.error.msg,userName:req.username});
      // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };
  
  export const userLogin = async (req, res, next) => {
    const resp = await userLoginRepo(req.body);
    if (resp.success) {
      const token = jwt.sign(
        //after image buffer - changed it to not pass entire user (earlier it was user:resp.res)
        { _id: resp.res._id, username: resp.res.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res
        .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
        .cookie("wilfredarin", "coolestCoder", { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
        .redirect("/posts/");
    } else {
      res.render("user-login",{error:resp.error.msg,userName:req.username});
      // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };


  export const updateUserPassword = async (email,newPassword,next) => {
    const resp = await updateUserPasswordRepo(email, newPassword,next);
    return resp;
  };
  
  export const updateProfile = async (req,res,next) =>{
    const resp = await updateProfileRepo(req._id, req.body);
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "porfile updated successfully",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }
  export const userLogout = (req, res, next) => {
    res.clearCookie("jwtToken").redirect("/");
  };
  

  export const getUserRegistration = (req,res,next)=>{
    res.render("user-register",{userName:req.username,error:null});
  }

  export const getUserLogin = (req,res,next)=>{
    res.render("user-login",{userName:req.username,error:null});
  }

  export const getUserPosts = async(req,res,next)=>{
    const resp = await getUserPostsByIdRepo(req._id);
    if (resp) {
      res.render("post-feeds",{posts:resp,error:null});
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  }
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
  export const userRegisteration = async (req, res, next) => {

    
    let { password } = req.body;
    password = await bcrypt.hash(password, 12);
    const resp = await userRegisterationRepo({ ...req.body, password });
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "user registration successful",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };
  
  export const userLogin = async (req, res, next) => {
    const resp = await userLoginRepo(req.body);
    if (resp.success) {
      const token = jwt.sign(
        { _id: resp.res._id, user: resp.res },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res
        .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
        .json({ success: true, msg: "user login successful", token });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };


  export const updateUserPassword = async (req, res, next) => {
    const { newPassword } = req.body;
    const resp = await updateUserPasswordRepo(req._id, newPassword, next);
    if (resp.success) {
      res.status(201).json({
        success: true,
        msg: "password updated successfully",
        res: resp.res,
      });
    } else {
      next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
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
    res.clearCookie("jwtToken").json({ success: true, msg: "logout successful" });
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
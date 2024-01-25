import express from "express";
import { userLogin,userLogout,userRegisteration,updateUserPassword,updateProfile,
    getUserRegistration,getUserLogin,getUserPosts } from "./user.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";
import { uploadFile } from "../../middlewares/file-upload.middleware.js";
const router = express.Router();
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

// router.route("/register").post(uploadFile.single("image"),userRegisteration);
router.route("/register").post(upload.single("image"),userRegisteration);
router.route("/login").post(userLogin);
router.route("/logout").get(userLogout);
// router.route("/update/password").post(auth, updateUserPassword);
router.route("/update/profile").post(auth,updateProfile);


router.route("/register").get(getUserRegistration);
router.route("/login").get(getUserLogin);
router.route("/:userId").get(auth,getUserPosts);
export default router;
//needs testing update/profile
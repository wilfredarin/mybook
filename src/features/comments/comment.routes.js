import express from "express";
import { createComment } from "./comment.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";

//create a express router object
const router = express.Router();
router.route("/create-comment/:id").post(auth,createComment);

export default router;
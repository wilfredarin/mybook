import express from "express";
import {
    sendFriendRequest,
    acceptRequest,
    getOtherUsers,
    getFriendRequests,
    removeFriend
    ,rejectRequest
} from "./friends.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";
const router = express.Router();
router.route("/friend-request/:id").post(sendFriendRequest);
router.route("/accept-friend/:id").post(acceptRequest);
router.route("/requests").get(getFriendRequests);
router.route("/find-new-friend").get(getOtherUsers);
router.route("/reject-friend/:id").post(rejectRequest);
router.route("/remove-friend/:id").post(removeFriend);


export default router;
import express from "express";

import {
	getMergeUser,
  getMergeUserFriends,
  addRemoveMergeFriend,
} from "../controllers/mergeUsers.js"; // for getting user, getting user friends, adding/removing friend
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getMergeUser); // get user by id -> verify token first -> users/:id
router.get("/:id/friends", verifyToken, getMergeUserFriends); // get user friends by id -> verify token first -> users/:id/friends

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveMergeFriend); // add/remove friend

export default router;

import express from "express";

import {
  updateUserCoins,
	getMergeUser,
  getMergeUserFriends,
  addRemoveMergeFriend,
  rateUser,
} from "../controllers/mergeUsers.js"; // for getting user, getting user friends, adding/removing friend
import { verifyToken } from "../middleware/auth.js"; // for verifying token
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json({ limit: "30mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
/* READ */
router.patch("/:userId/rate", rateUser);
router.get("/:id", getMergeUser); // get user by id -> verify token first -> users/:id
router.patch("/mergeCoins/:userId", updateUserCoins); // update user coins by id -> verify token first -> users/:id
// router.get("/:id/friends", getMergeUserFriends); // get user friends by id -> verify token first -> users/:id/friends

// /* UPDATE */
// router.patch("/:id/:friendId", addRemoveMergeFriend); // add/remove friend

export default router;

import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js"; // for getting user, getting user friends, adding/removing friend
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); // get user by id -> verify token first -> users/:id
router.get("/:id/friends", verifyToken, getUserFriends); // get user friends by id -> verify token first -> users/:id/friends

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); // add/remove friend

export default router;

import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"; // for getting feed posts, getting user posts, liking post
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // get feed posts 
router.get("/:userId/posts", verifyToken, getUserPosts); // get user posts

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost); // like post

export default router;

import express from "express";
import { getFeedPosts, getUserPosts, likePost, dislikePost, getAllCategories, getAllLocations } from "../controllers/mergePosts.js"; // for getting feed posts, getting user posts, liking post
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

/* READ */
router.get("/", getFeedPosts); // get feed posts 
router.get("/:userId/posts", getUserPosts); // get user posts
router.get("/allCategories", getAllCategories); // get all categories
router.get("/allLocations", getAllLocations); // get all locations
/* UPDATE */
router.patch("/:postId/like", likePost); // like post
router.patch("/:postId/dislike", dislikePost); // like post


export default router;

import express from "express";
import { getUserApplications, getApplicants, getFeedPosts, getUserPosts, likePost, dislikePost, getAllCategories, getAllLocations, getLocations, getCategories, getPostsSortedByLikes, getPostsFilteredByCategory, getPostsFilteredByLocation, getLocation, getCategory, visiblePost, hidePost } from "../controllers/mergePosts.js"; // for getting feed posts, getting user posts, liking post
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); // get feed posts 
router.get("/:userId/posts", verifyToken, getUserPosts); // get user posts
router.get("/sortedByLikes", verifyToken, getPostsSortedByLikes); // get posts sorted by likes
router.get("/filteredByCategory/:categoryId", verifyToken, getPostsFilteredByCategory); // get posts filtered by category
router.get("/filteredByLocation/:locationId", verifyToken, getPostsFilteredByLocation); // get posts filtered by location
router.get("/allCategories", verifyToken, getAllCategories); // get all categories
router.get("/allLocations", verifyToken, getAllLocations); // get all locations
router.get("/locations", verifyToken, getLocations); // get all locations
router.get("/location/:locationId", verifyToken, getLocation); // get all locations
router.get("/categories", verifyToken, getCategories); // get all locations
router.get("/category/:categoryId", verifyToken, getCategory); // get all locations
/* UPDATE */
router.patch("/:postId/like", verifyToken, likePost); // like post
router.patch("/:postId/dislike", verifyToken, dislikePost); // like post
router.patch("/:postId/hide", verifyToken, hidePost);
router.patch("/:postId/visible", verifyToken, visiblePost);
router.get("/:postId/applicants", verifyToken, getApplicants); // get applicants for post
router.get("/:userId/applications", verifyToken, getUserApplications); //get applications for user

export default router;

import express from "express";
import { getTokens } from "../controllers/mergeTokens.js"; // for getting feed posts, getting user posts, liking post
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

/* READ */
router.get("/", getTokens); // get feed posts 

export default router;

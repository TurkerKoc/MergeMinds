import express from "express";
import { getWebinars, enrollInWebinar, updateUserCoins } from "../controllers/mergeWebinars.js"; // Add these
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

/* READ */
router.get("/", getWebinars); // get feed posts 


/* UPDATE */
router.patch("/enroll/:webinarId/:userId", verifyToken, enrollInWebinar); // enroll user in webinar
router.patch("/user/:userId", verifyToken, updateUserCoins); // update user coins

export default router;

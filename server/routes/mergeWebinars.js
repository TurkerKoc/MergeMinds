import express from "express";
import { getWebinars, enrollInWebinar, updateUserCoins } from "../controllers/mergeWebinars.js"; // Add these
import { verifyToken } from "../middleware/auth.js"; // for verifying token

import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json({ limit: "30mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

/* READ */
router.get("/", getWebinars); // get feed posts 


/* UPDATE */
router.patch("/enroll/:webinarId/:userId", verifyToken, enrollInWebinar); // enroll user in webinar
router.patch("/user/:userId", updateUserCoins); // update user coins

export default router;

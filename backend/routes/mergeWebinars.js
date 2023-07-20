import express from "express";
import { getWebinars, enrollInWebinar, updateUserCoins, getUserWebinars } from "../controllers/mergeWebinars.js"; // Add these
import { verifyToken } from "../middleware/auth.js"; // for verifying token

import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json({ limit: "30mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

/* READ */
router.get("/",verifyToken, getWebinars); // get feed posts
router.get('/userWebinars/:userId',verifyToken, getUserWebinars);


/* UPDATE */
router.patch("/enroll/:webinarId/:userId", verifyToken, enrollInWebinar); // enroll user in webinar
router.patch("/user/:userId",verifyToken, updateUserCoins); // update user coins

export default router;


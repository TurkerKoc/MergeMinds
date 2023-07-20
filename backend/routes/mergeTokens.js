import express from "express";
import { getTokens } from "../controllers/mergeTokens.js"; // for getting feed posts, getting user posts, liking post
import { verifyToken } from "../middleware/auth.js"; // for verifying token
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json({ limit: "30mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

/* READ */
router.get("/", verifyToken, getTokens); // get feed posts 

export default router;

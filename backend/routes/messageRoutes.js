import express from "express";
import {getLastMessageTimestampForUser, getMessages} from "../controllers/messageController.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

router.get("/:chatId", verifyToken, getMessages);
router.get("/lastMessageTimestamp/:userId", verifyToken, getLastMessageTimestampForUser);

export default router;
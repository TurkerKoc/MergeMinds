import express from "express";
import {getLastMessageTimestampForUser, getMessages} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:chatId", getMessages);

router.get("/lastMessageTimestamp/:userId", getLastMessageTimestampForUser);

export default router;
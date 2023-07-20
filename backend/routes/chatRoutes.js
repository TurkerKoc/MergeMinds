import express from "express";
import {createChat, findUserChats, findChatById} from "../controllers/chats.js";
import {verifyToken} from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createChat);
router.get("/:userId", verifyToken, findUserChats);
router.get("/:firstId/:secondId", verifyToken, findChatById);

export default router;
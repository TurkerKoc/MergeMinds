import express from "express";
import {createChat, findUserChats, findChatById} from "../controllers/chats.js";

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/:firstId/:secondId", findChatById);

export default router;
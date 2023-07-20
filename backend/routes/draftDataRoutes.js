import express from "express";
import {
    createDraftData,
    findUserDraftData,
    findDraftDataById,
    deleteDraftData,
    updateDraftData
} from "../controllers/draftDataControllers.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/", verifyToken, createDraftData);
router.get("/:userId", verifyToken,findUserDraftData);
router.get("/:draftId", verifyToken, findDraftDataById);
router.delete("/:draftId", verifyToken, deleteDraftData);
router.patch("/:draftId", verifyToken, updateDraftData);

export default router;

import express from "express";
import {
    createDraftData,
    findUserDraftData,
    findDraftDataById,
    deleteDraftData,
    updateDraftData
} from "../controllers/draftDataControllers.js";

const router = express.Router();

router.post("/", createDraftData);
router.get("/:userId", findUserDraftData);
router.get("/:draftId", findDraftDataById);
router.delete("/:draftId", deleteDraftData);
router.patch("/:draftId", updateDraftData);

export default router;

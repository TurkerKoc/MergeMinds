import express from 'express';
import {
    createSponsoredContent,
    getAllSponsoredContent,
    getSponsoredContent
} from '../controllers/sponsoredContentController.js';
import { verifyToken } from "../middleware/auth.js"; // for verifying token

const router = express.Router();

router.post('/', verifyToken, createSponsoredContent);
router.get('/', verifyToken, getAllSponsoredContent); // Route to fetch all sponsored content
router.get('/:sponsoredContentId', verifyToken, getSponsoredContent);

export default router;

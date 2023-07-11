import express from 'express';
import {
    createSponsoredContent,
    getAllSponsoredContent,
    getSponsoredContent
} from '../controllers/sponsoredContentController.js';

const router = express.Router();

router.post('/', createSponsoredContent);
router.get('/', getAllSponsoredContent); // Route to fetch all sponsored content
router.get('/:sponsoredContentId', getSponsoredContent);

export default router;

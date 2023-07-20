import SponsoredContent from '../models/SponsoredContent.js';
import mongoose from "mongoose"; // Assuming you have the SponsoredContent model imported

export const createSponsoredContent = async (req, res) => {
    try {
        const {
            userId, locationId, title, description, isHidden, prepaidApplicants, categoryId, priceId, picturePath
        } = req.body;

        // Create a new SponsoredContent instance
        const sponsoredContent = new SponsoredContent({
            userId: mongoose.Types.ObjectId(userId),
            locationId: mongoose.Types.ObjectId(locationId),
            title,
            description,
            isHidden,
            prepaidApplicants,
            categoryId: mongoose.Types.ObjectId(categoryId),
            priceId: mongoose.Types.ObjectId(priceId),
            likes: new Map(),
            dislikes: new Map(),
            Applications: [],
            picturePath
        });

        // Save the SponsoredContent item to the database
        const savedSponsoredContent = await sponsoredContent.save();

        res.status(201).json(savedSponsoredContent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create SponsoredContent' });
    }
};

export const getAllSponsoredContent = async (req, res) => {
    try {
        const sponsoredContent = await SponsoredContent.find();
        res.json(sponsoredContent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get sponsored content' });
    }
};

export const getSponsoredContent = async (req, res) => {
    try {
        const { sponsoredContentId } = req.params;

        // Find the SponsoredContent item by ID
        const sponsoredContent = await SponsoredContent.findById(sponsoredContentId);

        if (!sponsoredContent) {
            return res.status(404).json({ error: 'SponsoredContent not found' });
        }

        res.json(sponsoredContent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get SponsoredContent' });
    }
};

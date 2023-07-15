import draftDataModel from "../models/DraftData.js";

export const createDraftData = async (req, res) => {
    const {
        userId,
        title,
        description,
        applicantNumber,
        selectedCategory,
        selectedLocation,
        selectedIsHidden
    } = req.body;
    try {
        const draftData = await draftDataModel.findOne({
            userId,
            title,
            description,
            applicantNumber,
            selectedCategory,
            selectedLocation,
            selectedIsHidden
        });

        if (draftData) {
            res.status(200).json(draftData);
        } else {
            const newDraftData = new draftDataModel({
                userId,
                title,
                description,
                applicantNumber,
                selectedCategory,
                selectedLocation,
                selectedIsHidden
            });

            const response = await newDraftData.save();
            res.status(200).json(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

export const findUserDraftData = async (req, res) => {
    const userId = req.params.userId;

    try {
        const draftData = await draftDataModel.find({userId});

        res.status(200).json(draftData);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

export const findDraftDataById = async (req, res) => {
    const userId = req.params.userId;

    try {
        const draftData = await draftDataModel.findOne({userId});

        res.status(200).json(draftData);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

export const deleteDraftData = async (req, res) => {
    const {draftId} = req.params;

    try {
        const deletedDraft = await draftDataModel.findByIdAndDelete(draftId);

        if (deletedDraft) {
            res.status(200).json({message: "Draft deleted successfully"});
        } else {
            res.status(404).json({error: "Draft not found"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

export const updateDraftData = async (req, res) => {
    const { draftId } = req.params;
    const updateData = req.body;

    try {
        const updatedDraft = await draftDataModel.findByIdAndUpdate(
            draftId,
            updateData,
            { new: true }
        );

        if (updatedDraft) {
            res.status(200).json(updatedDraft);
        } else {
            res.status(404).json({ error: "Draft not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
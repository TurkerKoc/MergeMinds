import mongoose from "mongoose";

const draftDataSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        title: String,
        description: String,
        applicantNumber: Number,
        selectedCategory: String,
        selectedLocation: String,
        selectedIsHidden: String,
    },
    { timestamps: true }
);

const DraftData = mongoose.model("DraftData", draftDataSchema);

export default DraftData;

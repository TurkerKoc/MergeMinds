import mongoose from "mongoose";

const applicationSchema = mongoose.Schema(
  {
    content: String,
		userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
		ideaPostId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		}
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;

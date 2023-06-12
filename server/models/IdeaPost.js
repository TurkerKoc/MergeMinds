import mongoose from "mongoose";

const ideaPostSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
      required: true,
    },
    locationId: mongoose.Schema.Types.ObjectId,
		title: String, // title of post
    description: String, // description of post
		isHidden: Boolean, // if true, full post will not be visible to users (pay for details)
		prepaidApplicants: Number, // number of applicants that can apply for free
		categoryId: mongoose.Schema.Types.ObjectId, // category of post (e.g. "Web Development")
		priceId: mongoose.Schema.Types.ObjectId, // price to apply for idea
		picturePath: String, // path to picture of post
    likes: {
      type: Map, // Instead of using user ids, we will use a map to store user ids and whether they liked the post or not (true or false) -> more efficient (userId: true)
      of: Boolean,
    },
		dislikes: {
      type: Map, // Instead of using user ids, we will use a map to store user ids and whether they liked the post or not (true or false) -> more efficient (userId: true)
      of: Boolean,
    },
		Applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }]
  },
  { timestamps: true }
);

const IdeaPost = mongoose.model("IdeaPost", ideaPostSchema);

export default IdeaPost;

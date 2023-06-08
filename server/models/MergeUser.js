import mongoose from "mongoose"; // for database

const MergeUserSchema = new mongoose.Schema(
  {
    username: {
			type: String,
			required: true,
			min: 2,
			max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    name: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    surname: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
      trustPoints: Number,
      trustPointViewCount: Number,
    picturePath: {
      type: String,
      default: "",
    },
    friends: { // sub document of friends
      type: Array,
      default: [], // will conatain ids of friends
    },
    profileSummary: {
			type: String,
			default: "",
			max: 500,			
		},
		webSiteLink: String,
		mergeCoins: Number,
  },
  { timestamps: true } // will automatically create fields for createdAt and updatedAt
);

const MergeUser = mongoose.model("MergeUser", MergeUserSchema); // create model from schema
export default MergeUser; // export model for use in other files

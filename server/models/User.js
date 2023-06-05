import mongoose from "mongoose"; // for database

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
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
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: { // sub document of friends
      type: Array,
      default: [], // will conatain ids of friends
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  { timestamps: true } // will automatically create fields for createdAt and updatedAt
);

const User = mongoose.model("User", UserSchema); // create model from schema
export default User; // export model for use in other files

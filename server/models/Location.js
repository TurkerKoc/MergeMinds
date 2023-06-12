import mongoose from "mongoose";

const locationSchema = mongoose.Schema(
  {
    name: String,
  }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;
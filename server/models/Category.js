import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    domain: String
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
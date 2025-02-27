import mongoose from "mongoose";

const priceSchema = mongoose.Schema(
  {
    name: String,
		amount: Number,
    price: Number,
  }
);

const Price = mongoose.model("Price", priceSchema);

export default Price;
import mongoose from "mongoose";

const webinarSchema = mongoose.Schema(
  {
    title: String,
		description: Number,
		URL: String,
		DateAndTime: Date,
		priceId: mongoose.Schema.Types.ObjectId
  }
);

const Webinar = mongoose.model("Webinar", webinarSchema);

export default Webinar;
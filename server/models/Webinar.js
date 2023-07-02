import mongoose from "mongoose";

const webinarSchema = mongoose.Schema(
  {
    title: String,
		description: String,
		URL: String,
		start: Date,
		end: Date,
		price: Number,
		// userId should a list of users that are attending the webinar
		atendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],		
  }
);

const Webinar = mongoose.model("Webinar", webinarSchema);

export default Webinar;
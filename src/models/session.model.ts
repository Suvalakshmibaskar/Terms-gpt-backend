import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sessionSchema = new Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: "user",
		},
		login: {
			type: Date,
			default: Date.now(),
		},
		logout: Date,
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

const SessionModel = mongoose.model("session", sessionSchema);

export default SessionModel;

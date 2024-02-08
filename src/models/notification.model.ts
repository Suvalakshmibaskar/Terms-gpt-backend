import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "user" },
		from: { type: Schema.Types.ObjectId, ref: "user" },
		type: String,
		redirect_to: String,
		seen: {
			type: Boolean,
			default: false,
		},
		merge_fields: Object,
		data: Object,
		category: String,
		is_deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

const NotificationModel = mongoose.model("notification", notificationSchema);

export default NotificationModel;

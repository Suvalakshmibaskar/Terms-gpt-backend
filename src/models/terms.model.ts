import mongoose from "mongoose";
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    terms: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    summary: Array,
    summary_prompt: String,
    problem: Array,
    problem_prompt: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "modified_at" } }
);

//Model
const model = mongoose.model("terms", schema);

export default model;

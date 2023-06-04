import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: [true, "User Name is important"] },
    userPhoto: {
      type: String,
      required: [true, "Profile photo is required"],
    },
    discription: { type: String, required: [true, "Discriptionis required"] },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", CommentSchema);

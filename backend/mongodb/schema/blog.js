import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    topic: { type: String, required: [true, "Title required"] },
    discription: { type: String, required: [true, "Discriptionis required"] },
    image: {
      type: String,
      required: [true, "Image is required for reference"],
    },
    comments: [
      { type: mongoose.Types.ObjectId, required: true, ref: "Comment" },
    ],
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", BlogSchema);

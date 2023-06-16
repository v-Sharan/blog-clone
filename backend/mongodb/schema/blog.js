import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    image: {
      type: String,
      required: [true, "Image is required for reference"],
    },
    title: { type: String, required: [true, "Title required"] },
    discription: { type: String, required: [true, "Discriptionis required"] },
    comments: [
      { type: mongoose.Types.ObjectId, required: true, ref: "Comment" },
    ],
    // tags: [{ type: String, required: [true, "tag is required"] }],
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", BlogSchema);

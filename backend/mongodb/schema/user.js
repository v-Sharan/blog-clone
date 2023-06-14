import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "User Name is important"],
      unique: [true, "User already exists"],
    },
    email: {
      type: String,
      required: [true, "Email id is required"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password id is required"],
    },
    userPhoto: {
      type: String,
      required: [true, "Profile photo is required"],
    },
    blogs: [{ type: mongoose.Types.ObjectId, required: true, ref: "Blog" }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

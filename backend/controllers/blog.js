import { Blog } from "../mongodb/schema/blog.js";
import { User } from "../mongodb/schema/user.js";
import { HttpError } from "../utils/HttpError.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { creator, discription, title, image } = req.body;

  let existingUser;

  try {
    existingUser = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("There is no user in this user name", 500);
    return next(error);
  }

  const photoUrl = await cloudinary.uploader.upload(image);
  console.log(photoUrl.url);

  const createdBlog = new Blog({
    creator,
    title,
    username: existingUser.username,
    discription,
    comments: [],
    image: photoUrl.url,
    // tags,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBlog.save({ session: sess });
    existingUser.blogs.push(createdBlog);
    await existingUser.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while posting a blog",
      401
    );
    return next(error);
  }
  res.status(201).json({ message: "Blog Posted" });
};

export const getBlogById = async (req, res, next) => {
  const { blogId } = req.params;
  console.log(blogId);
  const blogs = await Blog.findById(blogId).populate(
    "creator",
    "-blogs -password"
  );
  if (blogs) {
    res.json(blogs);
  } else {
    next(new HttpError("No blogs found", 401));
  }
};

export const getBlogByUserId = () => {};

export const getAllBlog = async (req, res, next) => {
  const blogs = await Blog.find({}).populate("creator", "-password");
  if (blogs) {
    res.json(blogs);
  } else {
    next(new HttpError("No blogs found", 401));
  }
};

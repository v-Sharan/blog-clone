import { Blog } from "../mongodb/schema/blog.js";
import { User } from "../mongodb/schema/user.js";
import { HttpError } from "../utils/HttpError.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import fs from "fs";

export const createBlog = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { creator, discription, topic } = req.body;

  let existingUser, createdBlog;

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

  const splitPath = req.file.path.split("\\");

  try {
    createdBlog = new Blog({
      creator,
      topic,
      discription,
      comments: [],
      image: splitPath[0] + "/" + splitPath[1] + "/" + splitPath[2],
    });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

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

export const getBlogByUserId = async (req, res, next) => {
  const { userId } = req.params;
  let user;

  try {
    user = await User.findById(userId).populate("blogs", "-password ");
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("There is no user in this user name", 500);
    return next(error);
  } else {
    res.json({ user });
  }
};

export const getAllBlog = async (req, res, next) => {
  const blogs = await Blog.find({}).populate("creator", "-password -blogs");
  if (blogs) {
    res.json(blogs);
  } else {
    next(new HttpError("No blogs found", 401));
  }
};

export const blogDelete = async (req, res, next) => {
  const { blogId } = req.params;

  let blog;
  try {
    blog = await Blog.findById(blogId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not delete a place",
      500
    );
    return next(error);
  }

  if (!blog) {
    const error = new HttpError("Could not find  place for this id", 404);
    return next(error);
  }
  fs.unlink(blog.image, (err) => console.log(err));
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await blog.deleteOne({ session: sess });
    blog.creator.blogs.pull(blog);
    await blog.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not delete a place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted blog." });
};

export const blogUpdate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { discription, topic } = req.body;
  const { blogId } = req.params;

  console.log(blogId);

  let existingBlog, image, options;

  try {
    existingBlog = await Blog.findById(blogId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  if (!existingBlog) {
    const error = new HttpError("There is no Blog in this user name", 500);
    return next(error);
  }

  if (req.file) {
    fs.unlink(existingBlog.image, (err) => console.log(err));

    const splitPath = req.file.path.split("\\");
    image = splitPath[0] + "/" + splitPath[1] + "/" + splitPath[2];
    options = {
      topic,
      discription,
      image,
    };
  } else {
    options = {
      topic,
      discription,
    };
  }

  try {
    const updateBlog = await Blog.findByIdAndUpdate(blogId, options);

    res.status(201).json({ message: "Blog Posted" });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while posting a blog",
      401
    );
    return next(error);
  }
};

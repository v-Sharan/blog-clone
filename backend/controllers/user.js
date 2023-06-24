import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../mongodb/schema/user.js";
import { HttpError } from "../utils/HttpError.js";

export const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { username, email, password } = req.body;

  const jwtToken = jwt.sign({ email, username }, process.env.SECRET, {
    expiresIn: "90h",
  });

  try {
    let existingUser;

    try {
      existingUser = await User.findOne({ email: email });
    } catch (err) {
      const error = new HttpError(
        "Signing up failed, please again later.",
        500
      );
      return next(error);
    }
    if (existingUser) {
      const error = new HttpError(
        "user Already exist, insted of signin,click login",
        201
      );
      return next(error);
    } else {
      const createdUser = new User({
        username,
        email,
        password,
        userPhoto: "uploads/profile/6756f9b5-a463-4e6e-a5e1-ab43fdfc7fc6.png",
        blogs: [],
      });

      const userLoged = {
        id: createdUser._id,
        userPhoto: createdUser.userPhoto,
        username: createdUser.username,
        createdAt: createdUser.createdAt,
      };
      try {
        await createdUser.save();
        res.json({ user: userLoged, token: jwtToken });
      } catch (err) {
        const error = new HttpError("Signing in faild, try again later", 201);
        return next(error);
      }
    }
  } catch (error) {
    return next(new HttpError(error, 422));
  }
};

export const getUserByID = async (req, res, next) => {
  const { userId } = req.params;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        500
      )
    );
  }
  res.json({ user: existingUser });
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Log in failed, please try again later.", 500);
    return next(error);
  }
  const jwtToken = jwt.sign({ email }, process.env.SECRET, {
    expiresIn: "90h",
  });

  if (!user) {
    const error = new HttpError("User does't exist,Please sign in first", 402);
    return next(error);
  }

  if (user.email === email && user.password === password) {
    const userLoged = {
      id: user._id,
      userPhoto: user.userPhoto,
      username: user.username,
      createdAt: user.createdAt,
    };
    res.json({ user: userLoged, token: jwtToken });
  } else {
    return next(new HttpError("Credentials seems to be wrong", 500));
  }
};

export const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { userId } = req.params;
  const { username } = req.body;

  let user, image, updatedUser, options;
  if (req.file) {
    image = req.file.path;
    options = { username, userPhoto: image };
  } else {
    options = { username };
  }
  try {
    user = await User.findByIdAndUpdate(userId, options);
  } catch (err) {
    const error = new HttpError("Something went wrong while updating...", 500);
    return next(error);
  }

  if (!user) {
    return next(
      new HttpError("Could not identify user, please try again", 500)
    );
  }

  try {
    updatedUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!updatedUser) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        500
      )
    );
  }

  res.json({
    message: "updated",
    user: updatedUser,
  });
};

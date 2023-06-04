import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../mongodb/schema/user.js";
import { getUserDeatils } from "../utils/getUserDetails.js";
import { HttpError } from "../utils/HttpError.js";

export const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { token } = req.body;

  try {
    const { email, name, picture } = await getUserDeatils(token);

    let user_name = name.trim().length;

    if (user_name === 0) {
      return next(new HttpError("Enter a valid user name", 422));
    }

    if (!email.includes("@")) {
      return next(new HttpError("Enter a valid email", 422));
    }

    if (!picture.startsWith("http")) {
      return next(new HttpError("Check your photo link", 422));
    }
    const jwtToken = jwt.sign(
      {
        email,
        name,
      },
      process.env.SECRET,
      { expiresIn: "90h" }
    );
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
      res.json({ user: existingUser, jwtToken });
    }

    const createdUser = new User({
      username: name,
      email,
      userPhoto: picture,
      blogs: [],
    });

    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError("Signing in faild, try again later", 201);
      return next(error);
    }
    res.json({ user: createdUser, jwtToken });
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

  const jwtToken = jwt.sign(
    {
      email,
      name,
    },
    process.env.SECRET,
    { expiresIn: "90h" }
  );

  res.json({ user: existingUser, jwtToken });
};

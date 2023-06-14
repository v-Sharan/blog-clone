import { Router } from "express";
import { check } from "express-validator";
import {
  createUserByGoogle,
  getUserByID,
  createUser,
  login,
} from "../controllers/user.js";

const router = Router();

router.post(
  "/google/signup",
  [check("token").not().isEmpty()],
  createUserByGoogle
);
router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").isEmail(),
    check("password").not().isEmpty(),
  ],
  createUser
);
router.post(
  "/login",
  [check("email").isEmail(), check("password").not().isEmpty()],
  login
);

router.get("/:userId", getUserByID);

export default router;

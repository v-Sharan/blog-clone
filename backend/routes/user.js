import { Router } from "express";
import { check } from "express-validator";
import { createUser, getUserByID } from "../controllers/user.js";

const router = Router();

router.post("/signup", [check("token").not().isEmpty()], createUser);

router.get("/:userId", getUserByID);

export default router;

import { Router } from "express";
import { check } from "express-validator";
import {
  createBlog,
  getBlogById,
  getBlogByUserId,
} from "../controllers/blog.js";

import { checkToken } from "../middleware/CheckJwtToken.js";

const router = Router();

router.use(checkToken);

router.post("/", [check("token").not().isEmpty()], createBlog);

router.get("/:userId", getBlogByUserId);

router.get("/blog/:blogId", getBlogById);

export default router;

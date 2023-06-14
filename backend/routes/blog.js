import { Router } from "express";
import { check } from "express-validator";
import {
  createBlog,
  getBlogById,
  getBlogByUserId,
  getAllBlog,
} from "../controllers/blog.js";

import { checkToken } from "../middleware/CheckJwtToken.js";
import { fileUpload } from "../middleware/fileUpload.js";

const router = Router();

// router.use(checkToken);

router.post(
  "/blog",
  // fileUpload.single("image"),
  [
    check("creator").not().isEmpty(),
    // check("tag").not().isEmpty(),
    check("discription").not().isEmpty(),
  ],
  createBlog
);

router.get("/blog/:userId", getBlogByUserId);
router.get("/", getAllBlog);

router.get("/blog/:blogId", getBlogById);

export default router;

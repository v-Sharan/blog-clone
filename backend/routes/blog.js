import { Router } from "express";
import { check } from "express-validator";
import {
  createBlog,
  getBlogById,
  getBlogByUserId,
  getAllBlog,
} from "../controllers/blog.js";

import { checkToken } from "../middleware/CheckJwtToken.js";

const router = Router();

// router.use(checkToken);

router.post(
  "/blog",
  [
    check("creator").not().isEmpty(),
    // check("tag").not().isEmpty(),
    check("discription").not().isEmpty(),
    check("title").not().isEmpty(),
    check("image").not().isEmpty(),
  ],
  createBlog
);

router.get("/blogByUser/:userId", getBlogByUserId);
router.get("/", getAllBlog);

router.get("/blog/:blogId", getBlogById);

export default router;

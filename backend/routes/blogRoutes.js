import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Admin routes
router.post("/", protect, adminOnly, createBlog);
router.put("/:id", protect, adminOnly, updateBlog);
router.delete("/:id", protect, adminOnly, deleteBlog);

export default router;

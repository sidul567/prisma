import { Router } from "express";
import {
  createMultiplePost,
  createPost,
  deleteMultiplePost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controller/post.controller";

const router = Router();

router.post("/posts", createPost);
router.post("/multiple-posts", createMultiplePost);
router.put("/posts/:id", updatePost);
router.get("/posts/:id", getPost);
router.delete("/posts/:id", deletePost);
router.delete("/multiple-posts", deleteMultiplePost);
router.get("/posts", getPosts);

export default router;

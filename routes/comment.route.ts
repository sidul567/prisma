import { Router } from "express";
import {
  createComment,
  createMultipleComment,
  deleteComment,
  deleteMultipleComment,
  getComment,
  getComments,
  updateComment,
} from "../controller/comment.controller";

const router = Router();

router.post("/comments", createComment);
router.post("/multiple-comments", createMultipleComment);
router.put("/comments/:id", updateComment);
router.get("/comments/:id", getComment);
router.delete("/comments/:id", deleteComment);
router.delete("/multiple-comments", deleteMultipleComment);
router.get("/comments", getComments);

export default router;

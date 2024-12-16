import { Router } from "express";
import userRouter from "./user.route";
import postRouter from "./post.route";
import commentRouter from "./comment.route";

const router = Router();

router.use("/api/v1", userRouter);
router.use("/api/v1", postRouter);
router.use("/api/v1", commentRouter);

export default router;

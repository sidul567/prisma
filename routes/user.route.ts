import { Router } from "express";
import {
    createMultipleUser,
  createUser,
  deleteMultipleUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controller/user.controller";

const router = Router();

router.post("/users", createUser);
router.post("/multiple-users", createMultipleUser);
router.put("/users/:id", updateUser);
router.get("/users/:id", getUser);
router.delete("/users/:id", deleteUser);
router.delete("/multiple-users", deleteMultipleUser);
router.get("/users", getUsers);

export default router;

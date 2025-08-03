import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getAllTodos,
} from "../controllers/todoController";

const router = Router();

router.get("/", getAllTodos);
router.post("/", createTodo);
router.delete("/:id", deleteTodo);

export default router;

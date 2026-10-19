import {
  getTasks,
  getTaskById,
  createTask,
  editTask,
  deleteTask,
} from "../controllers/taskControllers.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import express from "express";

const taskRoutes = express.Router();

taskRoutes.get("/", isLoggedIn, getTasks);
taskRoutes.get("/:id", isLoggedIn, getTaskById);
taskRoutes.post("/", isLoggedIn, createTask);
taskRoutes.patch("/:id", isLoggedIn, editTask);
taskRoutes.delete("/:id", isLoggedIn, deleteTask);

export default taskRoutes;

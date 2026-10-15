import {
  login,
  logout,
  register,
  editUser,
  deleteUser,
  getUser,
} from "../controllers/userControllers.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import express from "express";

const userRoutes = express.Router();

userRoutes.get("/me", isLoggedIn, getUser);
userRoutes.post("/login", login);
userRoutes.post("/register", register);
userRoutes.patch("/edit", isLoggedIn, editUser);
userRoutes.delete("/delete",isLoggedIn, deleteUser);
userRoutes.post("/logout", isLoggedIn, logout);

export default userRoutes;

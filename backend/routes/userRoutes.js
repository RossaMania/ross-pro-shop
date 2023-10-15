import express from "express";

const router = express.Router();

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// "/" === /api/users
router.route("/").post(registerUser).get(protect, admin, getUsers); //Either a regular user registers or an Admin user gets all users.
router.post("/logout", logoutUser); //User logs out. This clears the cookie.
router.post("/login", authUser); //User logs in. This sets the cookie.
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile); //Either a user gets their own user profile page or updates their own user profile page.
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserByID)
  .put(protect, admin, updateUser); //An Admin user deletes a regular user, Admin user gets user by ID, or Admin user updates user

export default router;

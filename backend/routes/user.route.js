import express from "express";

import {
  signupUser,
  loginUser,
  logoutUser,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protectRoute, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

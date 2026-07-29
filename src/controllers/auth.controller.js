import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Handle local register
export const registerUser = asyncHandler(async (req, res) => {
  const { displayName, email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    displayName: displayName || email.split("@")[0],
    email: email.toLowerCase(),
    password: hashedPassword,
    provider: "local",
  });

  req.login(user, (err) => {
    if (err) {
      throw new ApiError(500, "Login after registration failed.");
    }
    return res.redirect("/dashboard");
  });
});

export const handleOAuthCallbackSuccess = asyncHandler(async (req, res) => {
  return res.redirect("/dashboard");
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user retrieved successfully"));
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      throw new ApiError(500, "Logout failed", [err.message]);
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.redirect("/");
    });
  });
});
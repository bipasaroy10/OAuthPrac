import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const handleOAuthCallbackSuccess = asyncHandler(async (req, res) => {
  // Successful OAuth login handler
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User logged in successfully"));
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
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  });
});
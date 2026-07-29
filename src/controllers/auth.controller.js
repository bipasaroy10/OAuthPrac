import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const handleOAuthCallbackSuccess = asyncHandler(async (req, res) => {
  // Redirect browser to dashboard on successful OAuth callback
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
    // Destroy session and redirect to login page
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.redirect("/");
    });
  });
});
import { Router } from "express";
import passport from "passport";
import {
  handleOAuthCallbackSuccess,
  getCurrentUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Google Auth Routes ---
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  handleOAuthCallbackSuccess
);

// --- Facebook Auth Routes ---
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  handleOAuthCallbackSuccess
);

// --- Microsoft Auth Routes ---
// router.get("/microsoft", passport.authenticate("microsoft"));

// router.get(
//   "/microsoft/callback",
//   passport.authenticate("microsoft", { failureRedirect: "/login" }),
//   handleOAuthCallbackSuccess
// );

// --- Protected & Session Routes ---
// router.get("/me", isAuthenticated, getCurrentUser);
// router.get("/logout", logoutUser);

export default router;
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
// routes/auth.routes.js

// 1. Initiate Google Login (MUST include scope)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Google Callback Handling
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  handleOAuthCallbackSuccess
);

// --- Facebook Auth Routes ---
// Request public_profile and email scope
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile"] })
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

// --- GitHub Routes ---
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  handleOAuthCallbackSuccess
);

// routes/auth.routes.js

router.get("/linkedin", passport.authenticate("linkedin"));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "/login" }),
  handleOAuthCallbackSuccess
);

// --- Session & Profile Routes ---
router.get("/me", isAuthenticated, getCurrentUser);
router.get("/logout", logoutUser);

export default router;
import { Router } from "express";
import passport from "passport";
import {
  handleOAuthCallbackSuccess,
  getCurrentUser,
  logoutUser,
  registerUser,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Local Authentication Routes ---
router.post("/register", registerUser);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

// --- Google Routes ---
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- Facebook Routes ---
router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- GitHub Routes ---
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- LinkedIn Routes ---
router.get("/linkedin", passport.authenticate("linkedin"));
router.get("/linkedin/callback", passport.authenticate("linkedin", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- Spotify Routes ---
router.get("/spotify", passport.authenticate("spotify", { scope: ["user-read-email", "user-read-private"], showDialog: true }));
router.get("/spotify/callback", passport.authenticate("spotify", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- Discord Routes ---
router.get("/discord", passport.authenticate("discord", { scope: ["identify", "email"] }));
router.get("/discord/callback", passport.authenticate("discord", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- Slack Routes ---
router.get("/slack", passport.authenticate("slack", { scope: ["identity.basic", "identity.email"] }));
router.get("/slack/callback", passport.authenticate("slack", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- GitLab Routes ---
router.get("/gitlab", passport.authenticate("gitlab", { scope: ["read_user", "api"] }));
router.get("/gitlab/callback", passport.authenticate("gitlab", { failureRedirect: "/" }), handleOAuthCallbackSuccess);

// --- X (Twitter) Routes ---
router.get(
  "/twitter",
  passport.authenticate("twitter", {
    scope: ["users.read", "tweet.read", "offline.access"],
  })
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  handleOAuthCallbackSuccess
);

// --- Twitch Routes ---
router.get(
  "/twitch",
  passport.authenticate("twitch", {
    scope: ["user:read:email"],
  })
);

router.get(
  "/twitch/callback",
  passport.authenticate("twitch", { failureRedirect: "/" }),
  handleOAuthCallbackSuccess
);

// --- Session & Profile Routes ---
router.get("/me", isAuthenticated, getCurrentUser);
router.get("/logout", logoutUser);

export default router;
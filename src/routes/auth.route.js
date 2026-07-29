import { Router } from "express";
import passport from "passport";
import {
  handleOAuthCallbackSuccess,
  getCurrentUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Google Routes ---
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- Facebook Routes ---
router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- GitHub Routes ---
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- LinkedIn Routes ---
router.get("/linkedin", passport.authenticate("linkedin"));
router.get("/linkedin/callback", passport.authenticate("linkedin", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- Spotify Routes ---
router.get("/spotify", passport.authenticate("spotify", { scope: ["user-read-email", "user-read-private"], showDialog: true }));
router.get("/spotify/callback", passport.authenticate("spotify", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- Discord Routes ---
router.get("/discord", passport.authenticate("discord", { scope: ["identify", "email"] }));
router.get("/discord/callback", passport.authenticate("discord", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- Slack Routes ---
router.get("/slack", passport.authenticate("slack", { scope: ["identity.basic", "identity.email"] }));
router.get("/slack/callback", passport.authenticate("slack", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- GitLab Routes ---
router.get("/gitlab", passport.authenticate("gitlab", { scope: ["read_user", "api"] }));
router.get("/gitlab/callback", passport.authenticate("gitlab", { failureRedirect: "/login" }), handleOAuthCallbackSuccess);

// --- X (Twitter) Routes ---
// --- X (Twitter) Routes ---
router.get(
  "/twitter",
  passport.authenticate("twitter", {
    scope: ["users.read", "tweet.read", "offline.access"],
  })
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
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
  passport.authenticate("twitch", { failureRedirect: "/login" }),
  handleOAuthCallbackSuccess
);

// --- Session & Profile Routes ---
router.get("/me", isAuthenticated, getCurrentUser);
router.get("/logout", logoutUser);

export default router;
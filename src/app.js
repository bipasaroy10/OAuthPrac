import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import passport from "./config/passport.js";
import { ApiError } from "./utils/ApiError.js";
import authRouter from "./routes/auth.route.js";

const app = express();

// ES Module directory path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View Engine & Static Assets Setup
// Resolves to root-level 'views' and 'public' folders from 'src/'
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

// Basic Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: false, // Set to true in production over HTTPS
      sameSite: "lax",
    },
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Page Render Routes
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  res.render("login");
});

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("dashboard", { user: req.user });
});

// OAuth & Auth API Routes
app.use("/auth", authRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Backend Error Caught:", err);

  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
  }

  // Handle JSON requests explicitly
  if (req.accepts("json") && !req.accepts("html")) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors || [],
      data: error.data || null,
    });
  }

  // Safe EJS rendering with fallback to JSON if view file is missing
  return res.status(error.statusCode).render("error", { error }, (renderErr, html) => {
    if (renderErr) {
      console.error("EJS View Render Error:", renderErr.message);
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        details: "Render error or missing 'views/error.ejs' template.",
      });
    }
    res.send(html);
  });
});

export default app;
import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import { ApiError } from "./utils/ApiError.js";
import authRouter from "./routes/auth.route.js";

const app = express();

// Basic Middleware
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
    },
  })
);

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// Route Declarations
app.use("/auth", authRouter);

// Global Error Handling Middleware using ApiError
app.use((err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, [], err.stack);
  }

  return res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    errors: error.errors,
    data: error.data,
  });
});

export default app;
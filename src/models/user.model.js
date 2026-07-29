import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined for local users while keeping uniqueness for OAuth users
    },
    provider: {
      type: String, // 'local', 'google', 'facebook', 'github', etc.
      required: true,
      default: "local",
    },
    displayName: {
      type: String,
      default: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String, // Hashed password for local auth
    },
    avatar: String,
    spotifyId: String,
    discordId: String,
    slackId: String,
    twitterId: String,
    twitchId: String,
    gitlabId: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
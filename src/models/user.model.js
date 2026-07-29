import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
    },
    provider: {
      type: String, // 'google', 'facebook', 'github', 'linkedin', 'spotify', 'discord', 'slack'
      required: true,
    },
    displayName: {
      type: String,
      default: "User",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    spotifyId: String,
    discordId: String,
    slackId: String,
    avatar: String,
    twitterId: String,
    twitchId: String,
    avatar: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
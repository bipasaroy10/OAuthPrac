// Example using MongoDB / Mongoose scheme structure
import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema(
  {
    providerId: {
      type: String,
      required: true,
      unique: true,
    },
    provider: {
      type: String, // 'google', 'facebook', or 'microsoft'
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
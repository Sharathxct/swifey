import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  walletBalance: {
    type: Number,
    default: 0,
  }
});

export const User = mongoose.model("User", userSchema);

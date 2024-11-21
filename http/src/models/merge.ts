import mongoose from "mongoose";

const mergeSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
});

export const User = mongoose.model("User", mergeSchema);

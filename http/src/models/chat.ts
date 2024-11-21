import { timeStamp } from "console";
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  users: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  timeStamp
});

export const User = mongoose.model("User", chatSchema);

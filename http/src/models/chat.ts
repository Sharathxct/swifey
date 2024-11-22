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

export const Chat = mongoose.model("Chat", chatSchema);

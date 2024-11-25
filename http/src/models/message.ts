import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conId: {
    type: String,
    ref: "Conversation",
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "file"],
    required: true,
  },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);


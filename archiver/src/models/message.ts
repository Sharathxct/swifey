import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
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

import mongoose from "mongoose";

const swipeSchema = new mongoose.Schema({
  swiper: {
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
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
  }
});

export const User = mongoose.model("User", swipeSchema);

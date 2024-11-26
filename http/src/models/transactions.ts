import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw", "swipe"],
    required: true,
  },
  add: {
    type: Boolean,
    required: false,
  },

}, { timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);

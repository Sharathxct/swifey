import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  conversationId: { // fromUserId + toUserId
    type: String,
    required: true,
  },
  messages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Message",
    required: true,
  },
});

export const Conversation = mongoose.model("Conversation", conversationSchema);

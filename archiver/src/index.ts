import mongoose from "mongoose";
import Redis from "ioredis";
import dotenv from "dotenv";
import { Conversation } from "./models/conversation";
import { Message } from "./models/message";

dotenv.config();

const queue = new Redis();

//@ts-ignore
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to mongodb");
  while (true) {
    archiver();
  }
});

function archiver() {
  queue.brpop("archiver", 0, (err, message) => {
    if (err) {
      console.log(err);
    } else {
      // save the message to the database with id fromUserId + toUserId
      // what will the message object from the queue look like?
      // { fromUserId, toUserId, messageId, content, type }
      // transaction to creat a new message in the message model and update the conversation
      messageTransaction(message);
    }
  });
}

async function messageTransaction(message: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const msg = new Message({
      content: message.content,
      type: message.type,
      from: message.from,
      to: message.to,
    });
    await msg.save();
    const cId = getConversationId(message.from, message.to);
    const conversation = new Conversation({
      conversationId: cId,
      messages: [msg._id],
    });
    await conversation.save();
    session.commitTransaction();

    console.log("message created");
  } catch (e) {
    console.log(e);
    session.abortTransaction();
  }
}

function getConversationId(fromUserId: string, toUserId: string) {
  const sortedUserIds = [fromUserId, toUserId].sort();
  return `${sortedUserIds[0]}+${sortedUserIds[1]}`;
}

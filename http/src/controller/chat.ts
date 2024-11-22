import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";

const getConversation = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const { receiver } = req.body;
  const conversationId = getConversationId(userId, receiver);

  const conversation = await Conversation.findOne({ conversationId });
  if (!conversation) {
    return res.status(400).send("Conversation not found");
  }
  res.send(conversation.messages);
}

const getMessages = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const { msgIds } = req.body;
  const messages = await getMessagesFromIds(msgIds);
  res.send(messages);
}


function getConversationId(fromUserId: string, toUserId: string) {
  const sortedUserIds = [fromUserId, toUserId].sort();
  return `${sortedUserIds[0]}+${sortedUserIds[1]}`;
}

async function getMessagesFromIds(msgIds: string[]) {
  return await Message.find({ _id: { $in: msgIds } });
}

export {
  getConversation,
  getMessages
}

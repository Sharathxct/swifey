import { Router } from "express";
import { getConversation, getMessages } from "../controller/chat";
import { auth } from "../middleware/auth";

const chat = Router();

//@ts-ignore
chat.post("/getConversation", auth, getConversation);

// @ts-ignore
chat.post("/messages", auth, getMessages)

export default chat;

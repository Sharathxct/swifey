import { Router } from "express";
import { getConversation, getMessages } from "../controller/chat";

const chat = Router();

//@ts-ignore
chat.post("/getConversation", getConversation);

// user will send an array of messageIds 
chat.post("/messages", getMessages)

export default chat;

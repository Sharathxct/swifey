import { Request, Response } from "express";
import Graphdb from "../db";

const getProfiles = async (req: Request, res: Response) => {
  //@ts-ignore
  const users = await Graphdb.usersWithNoCurrentUser(req.user.id);
  res.send(users);
}

const getConversation = async (_req: Request, res: Response) => {
  //@ts-ignore
  res.send("TODO");
}

export {
  getProfiles,
  getConversation
}

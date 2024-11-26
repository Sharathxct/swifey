import { Request, Response } from "express";
import Graphdb from "../db";
import { Connection } from "../models/connection";

const getProfiles = async (req: Request, res: Response) => {
  //@ts-ignore
  if (!req.user.userId) {
    return res.status(401).send("Unauthorized");
  }
  //@ts-ignore
  const users = await Graphdb.usersWithNoCurrentUser(req.user.userId);
  res.send(users);
}

const getMyConnectionsReq = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const connections = await Connection.find({ to: userId, status: "pending" }).populate({ path: "from", select: 'username email imageUrl' }).lean();
  const connectionRequests = connections.map(conn => {
    return {
      ...conn.from,
      connectionId: conn._id
    }
  });
  if (!connectionRequests) {
    return res.status(200).send([]);
  }
  res.send(connectionRequests);
}

const getMyChats = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const chats = await Connection.find({ from: userId, status: "accepted" }).populate({ path: "to", select: 'username email imageUrl' }).lean();
  const connectionRequests = chats.map(conn => conn.to);
  if (!connectionRequests) {
    return res.status(200).send([]);
  }
  res.send(connectionRequests);
}

const getProfile = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const user = await Graphdb.userWithNoCurrentUser(userId);
  console.log("user", user)
  res.send(user);
}


export {
  getProfiles,
  getMyConnectionsReq,
  getProfile,
  getMyChats
}

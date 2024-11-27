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
  console.log("getMyChats")
  //@ts-ignore
  const { userId } = req.user;
  console.log("userId", userId)

  const chats = await Connection.find({
    status: 'accepted',
    $or: [{ from: userId }, { to: userId }]
  })
    .populate({
      path: 'to',
      select: 'username email imageUrl',
      match: { from: { $ne: userId } }
    })
    .populate({
      path: 'from',
      select: 'username email imageUrl',
      match: { to: { $ne: userId } }
    })
    .lean();
  console.log("chats", chats)

  const connectionRequests = chats.map(conn => {
    if (conn.to._id.toString() === userId) {
      return conn.from
    } else {
      return conn.to
    }
  });

  if (!connectionRequests) {
    return res.status(200).send([]);
  }
  console.log("connectionRequests", connectionRequests)
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

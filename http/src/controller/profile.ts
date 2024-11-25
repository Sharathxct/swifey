import { Request, Response } from "express";
import Graphdb from "../db";
import { Connection } from "../models/connection";

const getProfiles = async (req: Request, res: Response) => {
  //@ts-ignore
  console.log(req.user)

  //@ts-ignore
  if (!req.user.userId) {
    return res.status(401).send("Unauthorized");
  }
  //@ts-ignore
  const users = await Graphdb.usersWithNoCurrentUser(req.user.userId);
  res.send(users);
}

const getMyConnections = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const connections = await Connection.find({ to: userId });
  if (!connections) {
    return res.status(200).send([]);
  }
  res.send(connections);
}

const getProfile = async (req: Request, res: Response) => {
  console.log("req received get profile")
  //@ts-ignore
  const { userId } = req.user;
  const user = await Graphdb.userWithNoCurrentUser(userId);
  console.log("user", user)
  res.send(user);
}


export {
  getProfiles,
  getMyConnections,
  getProfile
}

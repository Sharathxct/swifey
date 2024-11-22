import { Request, Response } from "express";
import Graphdb from "../db";
import { Connection } from "../models/connection";

const getProfiles = async (req: Request, res: Response) => {
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


export {
  getProfiles,
  getMyConnections
}

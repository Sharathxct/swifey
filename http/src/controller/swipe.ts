import { Request, Response } from "express";
import { User } from "../models/user";
import Graphdb from "../db";
import { Connection } from "../models/connection";

//TODO: reduce the number of network calls
const right = async (req: Request, res: Response) => {
  console.log("right")
  //@ts-ignore
  const { userId } = req.user;
  const { receiver } = req.body;
  if (!receiver) {
    console.log("no receiver")
    return res.status(400).send("bad request");
  }

  try {
    console.log("in try")
    const rec = await User.findById(receiver);
    if (!rec) {
      return res.status(400).send("User not found");
    }
    Graphdb.likeUser(userId, receiver).then(() => {
      console.log("liked")
      res.send("swiped");
    }).catch((e) => {
      console.log(e);
      res.status(500).send({ error: "server error" })
    })
  }
  catch (e) {
    console.log(e);
    // refund
    res.status(500).send({ error: "server error" })
  }
}

const left = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const { receiver } = req.body;

  try {
    Graphdb.dislikeUser(userId, receiver).then(() => {
      res.send("swiped");
    }).catch((e) => {
      console.log(e);
      res.status(500).send({ error: "server error" })
    })
  }
  catch (e) {
    console.log(e);
    res.status(500).send({ error: "server error" })
  }
}

const accept = async (req: Request, res: Response) => {
  console.log("accept request")
  //@ts-ignore
  const { userId } = req.user;
  const { conId } = req.body;
  console.log("conId", conId)
  try {
    const con = await Connection.findById(conId);
    console.log("con", con)

    if (!con) {
      return res.status(400).send("Connection not found");
    }

    if (con.to !== userId) {
      console.log("invalid connection")
      return res.status(400).send("Invalid connection");
    }

    const to = await User.findById(userId);
    console.log("to", to)

    if (!to) {
      return res.status(400).send("User not found");
    }

    to.walletBalance = (parseFloat(to.walletBalance) + 0.2).toString();
    to.save();

    con.status = "accepted";
    con.save();
    res.send("accepted");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "server error" })
  }
}

const reject = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const { conId } = req.body;
  try {
    const con = await Connection.findById(conId);
    if (!con) {
      return res.status(400).send("Connection not found");
    }
    if (con.to !== userId) {
      return res.status(400).send("Invalid connection");
    }
    con.status = "rejected";
    con.save();
    const to = await User.findById(userId);
    if (!to) {
      return res.status(400).send("User not found");
    }
    to.walletBalance = (parseFloat(to.walletBalance) + 0.2).toString();
    to.save();
    res.send("rejected");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "server error" })
  }
}

const end = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const { conId } = req.body;
  try {
    const con = await Connection.findById(conId);
    if (!con) {
      return res.status(400).send("Connection not found");
    }
    con.status = "end";
    con.save();

    User.findById(userId).then((user) => {
      if (!user) {
        return res.status(400).send("User not found");
      }
      user.walletBalance = (parseFloat(user.walletBalance) + 0.2).toString();
      user.save();
      res.send("completed");
    })

    res.send("completed");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "server error" })
  }
}


export {
  right,
  left,
  accept,
  reject,
  end
}

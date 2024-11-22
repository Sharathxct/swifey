import { Request, Response } from "express";
import { User } from "../models/user";
import Graphdb from "../db";

const right = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const { receiver } = req.body;

  // first check if the user has enough balance and deduct sol 0.2
  // make a connection in graphdb
  // add the connection in relational db
  // send a notification to the receiver

  // 3 network calls in right swipe verification of receiver, deduction of sol, graphdb connection, relational db connection
  if (!receiver) {
    return res.status(400).send("bad request");
  }

  try {
    const rec = await User.findById(receiver);

    if (!rec) {
      return res.status(400).send("User not found");
    }

    User.findById(userId).then((user) => {
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (parseFloat(user.walletBalance) < 0.2) {
        return res.status(400).send("Insufficient balance");
      }
      user.walletBalance = (parseFloat(user.walletBalance) - 0.2).toString();
      user.save();
    })

    Graphdb.likeUser(userId, receiver).then(() => {
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

export {
  right,
  left
}

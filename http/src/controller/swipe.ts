import { Request, Response } from "express";
import { User } from "../models/user";
import Graphdb from "../db";
import { Transaction } from "../models/transactions";
import { Connection } from "../models/connection";
import mongoose from "mongoose";

//TODO: reduce the number of network calls
const right = async (req: Request, res: Response) => {
  //@ts-ignore
  const { userId } = req.user;
  const { receiver } = req.body;

  // first check if the user has enough balance and deduct sol 0.2
  // make a connection in graphdb
  // add the connection in relational db
  // send a notification to the receiver

  // 5 network calls in right swipe verification of receiver, deduction of sol, update transaction, 
  // graphdb connection, relational db connection
  // Ideally check if we can manage connection in graphdb and delete the connections in relational db
  // And make a db transaction to deduct sol and update the transaction
  if (!receiver) {
    return res.status(400).send("bad request");
  }

  try {
    const rec = await User.findById(receiver);

    if (!rec) {
      return res.status(400).send("User not found");
    }

    const u = await User.findById(userId);
    if (!u) {
      return res.status(400).send("User not found");
    }
    if (parseFloat(u.walletBalance) < 0.2) {
      return res.status(400).send("Insufficient balance");
    }
    u.walletBalance = (parseFloat(u.walletBalance) - 0.2).toString();
    u.save();
    const transaction = new Transaction({
      userId,
      amount: "0.2",
      type: "swipe",
      receiver: new mongoose.Types.ObjectId(receiver),
    });
    transaction.save();

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

const accept = async (req: Request, res: Response) => {
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

    const to = await User.findById(userId);

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

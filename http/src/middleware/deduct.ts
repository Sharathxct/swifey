import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { Transaction } from "../models/transactions";

export async function deduct(req: Request, res: Response, next: NextFunction) {
  console.log("deduct middleware")
  //@ts-ignore
  const { userId } = req.user;

  try {
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
      add: false,
    });
    transaction.save();
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "server error" })
  }
}

import { Request, Response } from "express";
import { User } from "../models/user";

const deposit = async (req: Request, res: Response) => {
  const { amount } = req.body;
  //@ts-ignore
  const { userId } = req.user;

  try {
    User.findById(userId).then((user) => {
      if (!user) {
        return res.status(400).send("User not found");
      }
      user.walletBalance = (parseFloat(user.walletBalance) + parseFloat(amount)).toString();
      user.save();
      res.send("deposited");
    })
  }
  catch (e) {
    console.log(e);
    res.status(500).send({ error: "server error" })
  }

}

const withdraw = async (req: Request, res: Response) => {
  const { amount, publicKey } = req.body;
  console.log("withdraw req received", amount, publicKey)
  res.send("processing");
}

export {
  deposit,
  withdraw
}

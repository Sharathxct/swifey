import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).send("User not found");
  }

  //@ts-ignore
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).send("Invalid password");
  }

  //@ts-ignore
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.send({ token });
}

export const signup = async (req: Request, res: Response) => {
  const { username, email, password, dob, gender, college, company } = req.body;
  const check = await User.findOne({ username });

  if (check) {
    return res.status(400).send("Username taken");
  }

  const user = new User({
    username,
    email,
    dob,
    password,
    gender,
    college,
    company
  });

  await user.save().then(() => {
    res.send("signup");
  }).catch((e) => {
    res.status(500).send(e);
  });

  //@ts-ignore
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.send({ token });
}




import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import Graphdb from "../db";

export const signin = async (req: Request, res: Response) => {
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

function convertToDate(dateString: string): Date | null {
  const parts = dateString.split('-');  // Split by '-'
  if (parts.length !== 3) {
    console.error('Invalid date format');
    return null;
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  // Return the Date object
  return new Date(year, month, day);
}

export const signup = async (req: Request, res: Response) => {
  const { username, email, password, dob, gender, college, company } = req.body;
  console.log("signup req received", username, email, password, dob, gender, college, company)
  const check = await User.findOne({ username });
  let flag = false;

  if (check) {
    return res.status(400).send("Username taken");
  }

  const user = new User({
    username,
    email,
    dob: convertToDate(dob),
    password,
    gender,
    college,
    company
  });


  user.save().then(() => {
    flag = true;
    console.log("user created", user)
    Graphdb.creatUser(user.username, user._id.toString(), user.dob, user.gender, user.college, user.company).then((a) => {
      console.log(a)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
      res.send({ token });
    })
  })
    .catch((e) => {
      console.log(e);
      if (flag) {
        // delete user object from mongodb
        User.deleteOne({ _id: user._id }).then(() => {
          res.status(500).send({ error: "server error" })
        })
      } else {
        res.status(500).send({ error: "server error" })
      }
    });
}




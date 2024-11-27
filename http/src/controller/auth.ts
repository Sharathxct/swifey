import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import Graphdb from "../db";
import { v2 as cloudinary } from 'cloudinary';

export const signin = async (req: Request, res: Response) => {
  console.log("req received", req.body)
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    console.log("user not found")
    return res.status(400).send("User not found");
  }

  //@ts-ignore
  const isMatch = await user.comparePassword(password);
  console.log("isMatch", isMatch)

  if (!isMatch) {
    return res.status(400).send("Invalid password");
  }

  //@ts-ignore
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  console.log("token", token)

  res.send({ token });
}

function convertToDate(dateString: string): Date | null {
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    console.error('Invalid date format');
    return null;
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

export const signup = async (req: Request, res: Response) => {
  const { username, email, password, dob, gender, college, company } = req.body;
  console.log("signup req received", username, email, password, dob, gender, college, company)
  const check = await User.findOne({ username });

  if (check) {
    return res.status(400).send("Username taken");
  }

  let imageUrl = null;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'user-profiles',
    });

    imageUrl = uploadResponse.secure_url;
  }

  const user = new User({
    username,
    email,
    dob: convertToDate(dob),
    password,
    gender,
    college,
    company,
    imageUrl
  });

  user.save().then(() => {
    console.log("user created in mongodb", user)
    Graphdb.creatUser(user.username, user._id.toString(), user.dob.getFullYear(), user.gender, user.college, user.company, user.imageUrl, user.isVerified).then((a) => {
      console.log("user created in graphdb", a)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
      res.send({ token });
    }).catch((e) => {
      console.log(e);
      User.deleteOne({ _id: user._id }).then(() => {
        res.status(500).send({ error: "server error" })
      })
    })
  }).catch((e) => {
    console.log(e);
    res.status(500).send({ error: "server error" })
  });
}






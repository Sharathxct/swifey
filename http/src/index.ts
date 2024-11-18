import express from "express";
import mongoose from "mongoose"
import { User } from "./models/user";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

app.get("/test", (_req, res) => {
  const user = new User({
    name: "sharath",
    email: "sharath@swifey",
    password: "1234",
    dob: new Date(),
    gender: "male",
    college: "vit",
    company: "swifey",
  });

  user.save().then((user) => {
    res.send(user);
  });

});


mongoose.connect("mongodb+srv://sharath:1234@cluster0.fshqrdi.mongodb.net/swifey").then(() => {
  app.listen(3000, () => {
    console.log("Server started on port 3000 and connected to mongodb");
  })
}).catch((e) => console.log(e))

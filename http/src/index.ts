import express from "express";
import mongoose from "mongoose"
import router from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (_req, res) => {
  res.send("Helthy");
});

app.use("/api", router);

//@ts-ignore
mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(3000, () => {
    console.log("Server started on port 3000 and connected to mongodb");
  })
}).catch((e) => console.log(e))

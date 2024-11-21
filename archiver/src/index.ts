import mongoose from "mongoose";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const queue = new Redis();

//@ts-ignore
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to mongodb");
  while (true) {
    archiver();
  }
});

function archiver() {
  queue.brpop("archiver", 0, (err, message) => {
    if (err) {
      console.log(err);
    } else {
      // save the message to the database with id fromUserId + toUserId
    }
  });
}

import ws from "ws";
import Redis from "ioredis";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const publisher = new Redis();
const subscriber = new Redis();
const queue = new Redis();

const wss = new ws.Server({ port: 3001 });

subscriber.subscribe("messages");

subscriber.on("message", (channel, message) => {
  if (wss.clients.size > 0) {
    wss.clients.forEach((client) => {
      //@ts-ignore
      if (client.user.id === channel) {
        client.send(message);
      }
    });
  }
});

wss.on("connection", (ws, req) => {
  console.log("New connection", req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    return ws.close(401, "Unauthorized");
  }
  try {
    //@ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //@ts-ignore
    ws.user = decoded;
    subscriber.subscribe(decoded.id);
  } catch (e) {
    return ws.close(401, "Unauthorized");
  }
  ws.on("message", (message) => {
    // publish to pubsub
    // send to queue for archiver to pick up and store in db
    publisher.publish(JSON.parse(message.toString()).to, message.toString());
    // { from, to, content, type }
    queue.lpush("archiver", message.toString());
    console.log(message);
  });

});

wss.on("listening", () => {
  console.log("Listening on port 3000");
});

// on message publish to pubsub and send to the queue for archiver to pick up and store in db
// on subscriber message check if the client is online and send the message to respective client if offline ignore


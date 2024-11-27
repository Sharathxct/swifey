import ws from "ws";
import dotenv from "dotenv";
import Redis from "ioredis";
import jwt from "jsonwebtoken";

dotenv.config();

const publisher = new Redis();
const subscriber = new Redis();
// const queue = new Redis();

const wss = new ws.Server({ port: 3001 });

subscriber.subscribe("messages");

subscriber.on("message", (channel, message) => {
  console.log("pubsub message", channel, message)
  if (wss.clients.size > 0) {
    wss.clients.forEach((client) => {
      //@ts-ignore
      if (client.user.id === channel) {
        client.send(message);
      }
    });
  }
});

wss.on("connection", (ws) => {
  console.log("New connection");
  ws.on("message", (message) => {
    processMessage(message.toString(), ws);
  });

});

wss.on("listening", () => {
  console.log("Listening on port 3001");
});


function processMessage(message: string, ws: ws) {
  const messageObject = JSON.parse(message);
  if (messageObject.event === "message") {
    if (!messageObject.to || !messageObject.content || !messageObject.type || !messageObject.from) {
      console.log("bad request")
      return ws.close(400, "Bad request");
    }
    //@ts-ignore
    if (!ws.user || messageObject.from !== ws.user.id) {
      console.log("unauthorized")
      return ws.close(401, "Unauthorized");
    }
    try {
      publisher.publish(messageObject.to, message);
      // queue.rpush("archiver", JSON.stringify(messageObject));
    } catch (e) {
      return ws.close(400, "Bad request");
    }
  }
  else if (messageObject.event === "auth") {
    if (!messageObject.token) {
      return ws.close(400, "Bad request");
    }
    try {
      //@ts-ignore
      const decoded = jwt.verify(messageObject.token, process.env.JWT_SECRET);
      //@ts-ignore
      ws.user = decoded;
      subscriber.subscribe(decoded.id);
      console.log("auth success and subscribed", decoded.id)
    } catch (e) {
      return ws.close(401, "Unauthorized");
    }
  }
}

// on message publish to pubsub and send to the queue for archiver to pick up and store in db
// on subscriber message check if the client is online and send the message to respective client if offline ignore

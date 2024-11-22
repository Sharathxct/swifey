import { Router } from "express";
import { right, left, accept, reject } from "../controller/swipe";
import { auth } from "../middleware/auth";

const swipe = Router();

//@ts-ignore
swipe.post("/right", auth, right);

//@ts-ignore
swipe.post("/left", auth, left);

//@ts-ignore
swipe.post("/accept", auth, accept);

//@ts-ignore
swipe.post("/reject", auth, reject);

export default swipe;

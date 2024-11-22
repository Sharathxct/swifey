import { Router } from "express";
import { right, left } from "../controller/swipe";

const swipe = Router();

//@ts-ignore
swipe.post("/right", right);

//@ts-ignore
swipe.post("/left", left);

swipe.post("/accept",)

swipe.post("/reject",)

export default swipe;

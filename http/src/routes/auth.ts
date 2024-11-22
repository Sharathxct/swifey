import { Router } from "express";
import { signin, signup } from "../controller/auth";

const auth = Router();

//@ts-ignore
auth.post("/signup", signup);

//@ts-ignore
auth.post("/signin", signin);

export default auth;

import { Router } from "express";
import { login, signup } from "../controller/auth";

const auth = Router();

//@ts-ignore
auth.post("/signup", signup);

//@ts-ignore
auth.post("/signin", login);

export default auth;

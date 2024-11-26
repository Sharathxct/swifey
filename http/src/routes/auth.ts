import { Router } from "express";
import { signin, signup } from "../controller/auth";
import multer from 'multer';

const auth = Router();

const upload = multer({ storage: multer.memoryStorage() });
//@ts-ignore
auth.post("/signup", upload.single('image'), signup);

//@ts-ignore
auth.post("/signin", signin);

export default auth;

import { Router } from "express";
import { getProfiles, getMyConnections } from "../controller/profile";
import { auth } from "../middleware/auth";

const profile = Router();

//@ts-ignore
profile.get("/profiles", auth, getProfiles);

//@ts-ignore
profile.get("/MyConnections", auth, getMyConnections);

export default profile;

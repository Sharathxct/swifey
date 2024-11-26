import { Router } from "express";
import { getProfiles, getMyConnectionsReq, getProfile, getMyChats } from "../controller/profile";
import { auth } from "../middleware/auth";

const profile = Router();

//@ts-ignore
profile.get("/profiles", auth, getProfiles);

//@ts-ignore
profile.get("/", auth, getProfile);

//@ts-ignore
profile.get("/MyConnections", auth, getMyConnectionsReq);

//@ts-ignore
profile.get("/MyChats", auth, getMyChats);

export default profile;

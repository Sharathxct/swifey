import { Router } from "express";
import { getProfiles, getMyConnections, getProfile } from "../controller/profile";
import { auth } from "../middleware/auth";

const profile = Router();

//@ts-ignore
profile.get("/profiles", auth, getProfiles);

//@ts-ignore
profile.get("/profile", auth, getProfile);

//@ts-ignore
profile.get("/MyConnections", auth, getMyConnections);

export default profile;

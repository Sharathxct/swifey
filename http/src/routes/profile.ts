import { Router } from "express";
import { getProfiles } from "../controller/profile";

const profile = Router();

profile.put("/",);

profile.get("/profiles", getProfiles);

profile.get("/MyConnections",);

export default profile;

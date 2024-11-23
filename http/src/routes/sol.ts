import { Router } from "express";
import { deposit, withdraw, balance } from "../controller/sol";
import { auth } from "../middleware/auth";

const sol = Router();

// @ts-ignore
sol.post("/withdraw", auth, withdraw);

// @ts-ignore
sol.post("/deposit", auth, deposit);

// @ts-ignore
sol.get("/balance", auth, balance);

export default sol;

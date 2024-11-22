import { Router } from "express";
import { deposit, withdraw } from "../controller/sol";

const sol = Router();

sol.post("/withdraw", withdraw);

sol.post("/deposit", deposit);

export default sol;

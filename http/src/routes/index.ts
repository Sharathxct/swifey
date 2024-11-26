import auth from "./auth";
import swipe from "./swipe";
import profile from "./profile";
import sol from "./sol";
import { Router } from "express";
import reclaim from "./reclaim";

const router = Router();

router.use("/auth", auth);
router.use("/swipe", swipe);
router.use("/profile", profile);
router.use("/sol", sol);
router.use("/reclaim", reclaim)

export default router;


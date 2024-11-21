import auth from "./auth";
import swipe from "./swipe";
import profile from "./profile";
import sol from "./sol";
import { Router } from "express";

const router = Router();

router.use("/auth", auth);
router.use("/swipe", swipe);
router.use("/profile", profile);
router.use("/sol", sol);

export default router;


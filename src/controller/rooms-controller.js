import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
const router = Router();
router.get("/rooms", releaseVerificationMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end();
});
export default router;

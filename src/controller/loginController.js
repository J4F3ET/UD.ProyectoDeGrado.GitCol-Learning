import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/middleware .js";
const router = Router();
router.get("/login", (req, res) => {
	res.render("login");
});
router.post("/login", releaseVerificationMiddleware, (req, res) => {
	res.status(200).json({message: "OK"});
	res.end()
});
router.get("/rooms", releaseVerificationMiddleware, (req, res) => {
	res.render("rooms");
	res.end()
});
router.get("/logout",releaseVerificationMiddleware, (req, res) => {
	res.clearCookie("access_token");
	res.render("login");
	res.end()
});
export default router;

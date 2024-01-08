import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import {
	challengeCreate,
	challengeFindByLevel,
} from "../model/challenge-service.js";
const router = Router();
router.get("/rooms", releaseVerificationMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end();
});
router.get("/challengesCreate", async (req, res) => {
	const key = challengeCreate(
		req.query.name,
		req.query.description,
		{},
		{},
		req.query.level
	);
	res.json(await key);
});
router.get("/challenges", async (req, res) => {
	console.log(req.query.level);
	const response = challengeFindByLevel(req.query.level || 0);
	res.json(await response);
});
export default router;

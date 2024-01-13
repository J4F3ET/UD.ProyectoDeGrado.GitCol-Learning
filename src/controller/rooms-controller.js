import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import {auth} from "../model/firebase-service.js";
import {roomCreate, roomUpdate, roomDelete, roomGet, roomGetAll, roomGetByLevel} from "../model/room-service.js";
const router = Router();
router.get("/rooms", releaseVerificationMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end();
});
router.post("/rooms", releaseVerificationMiddleware, async(req, res) => {
	const result = auth.verifyIdToken(req.headers.cookie.split("=")[1])
	res.json({
		ok: true ,
		room:await roomCreate(
			req.body.code,
			req.body.description,
			(await result).name,
			[(await result).uid],
			req.body.challenge,
			true,
			[],
			[],
			req.body.hidden,
			req.body.level
		)
	});
	res.end();
});
export default router;

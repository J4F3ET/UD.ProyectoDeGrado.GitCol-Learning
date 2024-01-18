import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import {verifyUserInAnyRoomMiddleware} from "./util/teamWorking-middleware.js";
import {auth} from "../model/firebase-service.js";
import {
	roomCreate,
	roomGetByCode,
	roomAddMember,
	roomGetAll, 
} from "../model/room-service.js";
const router = Router();
router.get("/rooms", releaseVerificationMiddleware,verifyUserInAnyRoomMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end();
});
router.get("/rooms/fit", releaseVerificationMiddleware, async(req, res) => {
	const room = roomGetByCode(req.query.code);
	const user =  auth.verifyIdToken(req.headers.cookie.split("=")[1]);
	const response = roomAddMember(await room,(await user).uid); 
	res.json({
		ok: true,
		response: (await response)?await room:false
	});
	res.end();
});
router.get("/rooms/code", releaseVerificationMiddleware, async(req, res) => {
	const room= roomGetByCode(req.query.code);
	res.json({
		ok: true,
		code: (await room) === null 
	});
	res.end();
});
router.post("/rooms", releaseVerificationMiddleware, async(req, res) => {
	const result = auth.verifyIdToken(req.headers.cookie.split("=")[1])
	res.json({
		ok: true ,
		room: await roomCreate(
			req.body.code,
			req.body.description,
			(await result).name,
			[(await result).uid],
			req.body.challenge,
			true,
			{},
			{},
			req.body.hidden,
			req.body.level
		)
	});
	res.end();
});
export default router;

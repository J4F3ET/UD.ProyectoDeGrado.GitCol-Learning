import { Router } from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import { verifyUserInRoomMiddleware } from "./util/teamWorking-middleware.js";
import { roomRemoveMember } from "../model/room-service.js";
import {auth} from "../model/firebase-service.js";
const router = Router();
router.get("/teamWorking*",releaseVerificationMiddleware,verifyUserInRoomMiddleware,(req, res) => {
    res.render("teamWorking-screen", { room: req.query.room });
});
router.patch("/teamWorking",releaseVerificationMiddleware,verifyUserInRoomMiddleware, async(req, res) => {
	const user = auth.verifyIdToken(req.headers.cookie.split("=")[1]);
	res.json({success: await roomRemoveMember(req.query.room, (await user).uid)});
});
export default router;
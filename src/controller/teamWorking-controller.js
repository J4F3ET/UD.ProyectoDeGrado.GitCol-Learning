import { Router } from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import { verifyUserInRoomMiddleware } from "./util/teamWorking-middleware.js";
import { roomRemoveMember,roomGet } from "../model/room-service.js";
import {auth} from "../model/firebase-service.js";
import { parseToRoomObject } from "../model/utils.js";
const router = Router();
/**
 * @openapi
 * /teamWorking:
 *   get:
 *     summary: Endpoint get page multi mode 
 *     description: Return page team worki  (multi-mode-screen).
 *     parameters:
 *       - in: query
 *         name: room
 *         required: true
 *         description: Key to room
 *         schema:
 *           type: string
 *           example: -No7-v6_p1qqbKY2gfzp
 *     responses:
 *       200:
 *         description: Succes return page
 *         content:
 *           text/html:
 *             example: multi-mode-screen.ejs
 *       401:
 *         description: Unauthorized and redirect to error view
 *         content:
 *           text/html:
 *             example: error-screen.ejs
 *       404:
 *         description: Room not found
 *         content:
 *           text/html:
 *             example: error-screen.ejs
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get("/teamWorking*",releaseVerificationMiddleware,verifyUserInRoomMiddleware,async (req, res) => {
	const roomSnapshot = await roomGet(req.query.room);
	const roomData = roomSnapshot.val();
	if (!roomData){
		return res.render("error", {
			error: err,
			message: "Room not found",
			status: 404
		});
		
	}
	const repository  = (await parseToRoomObject(req.query.room,roomData)).repository
	res.render("multi-mode-screen", {
		REF_STORAGE_REPOSITORY: "local" + req.query.room,
		REF_STORAGE_REPOSITORY_CLOUD: "origin" + req.query.room,
		REF_STORAGE_LOG: "log" + req.query.room,
		repository: JSON.stringify(repository),
	});
});
/**
 * @openapi
 * /teamWorking:
 *   patch:
 *     summary: Endpoint- Remove user to room 
 *     description: Delete user to room
 *     parameters:
 *       - in: query
 *         name: room
 *         required: true
 *         description: Room key
 *         schema:
 *           type: string
 *           example: -No7-v6_p1qqbKY2gfzp
 *     responses:
 *       200:
 *         description: Succes return boolean
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   success: true
 *               example2:
 *                 value:
 *                   success: false
 *       401:
 *         description: Unauthorized and redirect to error view
 *         content:
 *           text/html:
 *             example: error-screen.ejs
 *       403:
 *         description: Unknown user and redirect to error view
 *         content:
 *           text/html:
 *             example: error-screen.ejs
 *       500:
 *         description: Internal server error
 *         content:
 *           text/html:
 *             example: error-screen.ejs
 *     security: 
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.patch("/teamWorking",releaseVerificationMiddleware,verifyUserInRoomMiddleware, async(req, res) => {
	try {
		const user = auth.verifyIdToken(req.headers.cookie.split("=")[1]);
		res.json({success: await roomRemoveMember(req.query.room, (await user).uid)});
	} catch (error) {
		render("error", {
			error: error,
			message: error.message,
			status: 500
		}).end();
	}
	
});
export default router;
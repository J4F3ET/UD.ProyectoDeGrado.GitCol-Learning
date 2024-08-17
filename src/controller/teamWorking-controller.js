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
 *     summary: Endpoint para obtener la pantalla de trabajo en equipo.
 *     description: Retorna la pantalla de trabajo en equipo (multi-mode-screen).
 *     parameters:
 *       - in: query
 *         name: room
 *         required: true
 *         description: Key de la sala a la que se quiere unir el usuario.
 *         schema:
 *           type: string
 *           example: -No7-v6_p1qqbKY2gfzp
 *     responses:
 *       200:
 *         description: Éxito. Retorna la pantalla de trabajo en equipo.
 *         content:
 *           text/html:
 *             example: multi-mode-screen.ejs
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get("/teamWorking*",releaseVerificationMiddleware,verifyUserInRoomMiddleware,async (req, res) => {
	const roomSnapshot = await roomGet(req.query.room);
	const roomData = roomSnapshot.val();
	if (!roomData){
		res.render("error", {
			error: err,
			message: "Room not found",
			status: 404
		}).end();
		return;
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
 *     summary: Endpoint para remover un usuario de una sala.
 *     description: Verifica si el usuario está en la sala, lo remueve de la sala.
 *     parameters:
 *       - in: query
 *         name: room
 *         required: true
 *         description: Key de la sala a la que se quiere unir el usuario.
 *         schema:
 *           type: string
 *           example: -No7-v6_p1qqbKY2gfzp
 *     responses:
 *       200:
 *         description: Éxito. Retorna la sala para redireccionar al usuario.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   success: true # Indicando que el usuario fue removido de la sala (boolean)
 *               example2:
 *                 value:
 *                   success: false # Indicando que el usuario no fue removido de la sala (boolean)
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
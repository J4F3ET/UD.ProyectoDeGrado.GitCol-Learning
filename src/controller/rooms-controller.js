import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import {verifyUserInAnyRoomMiddleware} from "./util/teamWorking-middleware.js";
import {auth} from "../model/firebase-service.js";
import {
	roomCreate,
	roomGetByCode,
	roomAddMember,
	roomGetAll,
	roomGetAllPublic, 
} from "../model/room-service.js";
const router = Router();
/**
 * @openapi
 * /rooms:
 *   get:
 *     summary: Endpoint para obtener la pantalla de salas.
 *     description: Retorna la pantalla de salas (rooms-screen).
 *     responses:
 *       200:
 *         description: Éxito. Retorna la pantalla de salas.
 *         content:
 *           text/html:
 *             example: rooms-screen.ejs
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get("/rooms", releaseVerificationMiddleware,verifyUserInAnyRoomMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end();
});
/**
 * @openapi
 * /rooms/fit:
 *   get:
 *     summary: Endpoint para agregar un usuario a una sala.
 *     description: Verifica si el código de la sala es válido y si el usuario no está en la sala, lo agrega a la sala.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: Codigó de la sala a la que se quiere unir el usuario.
 *         schema:
 *           type: string
 *           example: WEDFSD
 *     responses:
 *       200:
 *         description: Éxito. Retorna la sala o un dalse.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   ok: true
 *                   code: "-No7-v6_p1qqbKY2gfzp" # Código de la sala (string)
 *               example2:
 *                 value:
 *                   ok: true
 *                   code: false # Indicando que el código no está disponible (boolean)
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get("/rooms/fit", releaseVerificationMiddleware, async(req, res) => {
	const room = roomGetByCode(req.query.code);
	const user =  auth.verifyIdToken(req.headers.cookie.split("=")[1]);
	const response = roomAddMember(await room,(await user).uid); 
	res.json({
		ok: true,
		response: (await response)?await room:false,
	});
	res.end();
});
/**
 * @openapi
 * /rooms/code:
 *   get:
 *     summary: Endpoint para obtener la sala dado un código.
 *     description: Dado un código de sala, retorna la sala correspondiente y si no existe retorna null.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: Codigó que se quiere buscar y verificar si existe.
 *         schema:
 *           type: string
 *           example: WEDFSD
 *     responses:
 *       200:
 *         description: Éxito. Retorna la sala o un null.
 *         content:
 *           application/json:
 *             examples:
 *               example1:
 *                 value:
 *                   ok: true
 *                   code: "-No7-v6_p1qqbKY2gfzp" # Código de la sala (string)
 *               example2:
 *                 value:
 *                   ok: true
 *                   code: null # Indicando que el código esta disponible
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get("/rooms/code", releaseVerificationMiddleware, async(req, res) => {
	const room= roomGetByCode(req.query.code);
	res.json({
		ok: true,
		code: (await room) === null 
	});
	res.end();
});
/**
 * @openapi
 * /rooms:
 *   post:
 *     summary: Endpoint para crear una sala.
 *     description: Crea una sala con los datos proporcionados y retorna la sala creada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código único que identifica la sala (entre 4 y 8 caracteres alfanuméricos).
 *                 example: "1232SA"
 *               description:
 *                 type: string
 *                 description: Descripción de la sala.
 *                 example: "Sala de prueba"
 *               challenge:
 *                 type: string
 *                 description: ID del desafío asociado a la sala.
 *                 example: "-NnfGdSQazWAwV3xm8kY"
 *               hidden:
 *                 type: boolean
 *                 description: Indica si la sala es visible (true) o no (false).
 *                 example: true
 *               level:
 *                 type: integer
 *                 description: Nivel de la sala (0 para Begginer, 1 para Intermediate, 2 para Advanced).
 *                 example: 0
 *     responses:
 *       200:
 *         description: Éxito. Retorna la sala creada.
 *         content:
 *           application/json:
 *             example:
 *               value:
 *                 ok: true
 *                 room: "-No7-v6_p1qqbKY2gfzp" # Código de la sala (string)
 *       401:
 *         description: Token de acceso no válido o ausente.
 *         content:
 *           text/html:
 *             example: login-screen.ejs
 *       security:
 *         - bearerAuth: []
 *         - cookieAuth: []
 */
router.post("/rooms", releaseVerificationMiddleware, async(req, res) => {
	const result = await auth.verifyIdToken(req.headers.cookie.split("=")[1])
	console.log("CONTROLADOR DE SALAS",result);
	const owner = result.name??result.email;
	const members = [result.uid];
	res.json({
		ok: true ,
		room: await roomCreate(
			req.body.code,
			req.body.description,
			owner,
			members,
			req.body.hidden
		)
	});
	res.end();
});
router.get("/rooms/all/public", releaseVerificationMiddleware, async(req, res) => {
	const rooms = roomGetAllPublic();
	res.json({
		ok: true,
		rooms: await rooms
	});
	res.end();
});
export default router;

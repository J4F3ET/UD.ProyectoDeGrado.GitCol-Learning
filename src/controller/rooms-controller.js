import { Router } from "express";
import { releaseVerificationMiddleware } from "./util/login-middleware .js";
import { verifyUserInAnyRoomMiddleware } from "./util/teamWorking-middleware.js";
import { auth } from "../model/firebase-service.js";
import { getUserByAuthUid } from "../model/user-service.js";
import {
	roomCreate,
	roomGetByCode,
	roomAddMember,
	roomGetAllPublic,
} from "../model/room-service.js";
import { HttpStatus } from "./util/httpStatus.js";
const router = Router();
/**
 * @openapi
 * /rooms:
 *   get:
 *     summary: Endpoint to get the rooms screen.
 *     description: Return room screen (rooms-screen).
 *     responses:
 *       200:
 *         description: Succes Render "rooms-screen"
 *         content:
 *           text/html:
 *             example: rooms-screen.ejs
 *       401:
 *         description: Error Unauthorized user
 *         content:
 *           text/html:
 *             example: error.ejs
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get(
	"/rooms",
	releaseVerificationMiddleware,
	verifyUserInAnyRoomMiddleware,
	(req, res) => {
		res.render("rooms-screen");
	}
);
/**
 * @openapi
 * /rooms/fit:
 *   get:
 *     summary: Endpoint to add a user to a room
 *     description: Check if the room code is validand if the user not in the room, adds him to the room
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         description: Room code to add user
 *         schema:
 *           type: string
 *           example: WEDFSD
 *     responses:
 *       200:
 *         description: Succes Return room code
 *         content:
 *           application/json:
 *             example:
 *                 value: "-No7-v6_p1qqbKY2gfzp" # Room code (string)
 *       401:
 *         description: Error Unauthorized user
 *         content:
 *           text/html:
 *             example: error.ejs
 *       403:
 *         description: Error Unknown user
 *       404:
 *         description: Error Room not found
 *       500:
 *         description: Error Internal server error
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get("/rooms/fit", releaseVerificationMiddleware, async (req, res) => {
	const room = await roomGetByCode(req.query.code);

	if (!room) return res.sendStatus(404);
	let token = null;
	try {
		token = await auth.verifyIdToken(req.headers.cookie.split("=")[1]);
	} catch (error) {
		res.sendStatus(HttpStatus.FORBIDDEN);
	}
	if (!token) return res.sendStatus(HttpStatus.FORBIDDEN);
	const { err, data } = await getUserByAuthUid(token.uid);

	if (err || !data.key || !data.email)
		return res.sendStatus(HttpStatus.NOT_FOUND);

	const response = await roomAddMember(room, data.uid);

	if (!response) return res.sendStatus(500);

	res.json(room);
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
 *         description: Succes Room found
 *       401:
 *         description: Error Unauthorized user
 *         content:
 *           text/html:
 *             example: error.ejs
 *       404:
 *         description: Error Room not found
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get("/rooms/code", releaseVerificationMiddleware, async (req, res) => {
	if (!(await roomGetByCode(req.query.code))) return res.sendStatus(404);
	res.end();
});
/**
 * @openapi
 * /rooms:
 *   post:
 *     summary: Endpoint by create in room
 *     description: Create in room with data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique code (between 4 to 8 alphanumeric characters).
 *                 example: "1232SA"
 *               description:
 *                 type: string
 *                 description: Room description.
 *                 example: "Test Room"
 *               hidden:
 *                 type: boolean
 *                 description:  Indicates whether the room is public (true) or not (false).
 *                 example: true
 *     responses:
 *       200:
 *         description: Succes Return id room created
 *         content:
 *           application/json:
 *             example:
 *               value: "-No7-v6_p1qqbKY2gfzp"
 *       400:
 *         description: Error Bad Request
 *         content:
 *           text/html:
 *             example: login-screen.ejs
 *       401:
 *         description: Error Unauthorized user
 *         content:
 *           text/html:
 *             example: login-screen.ejs
 *       security:
 *         - bearerAuth: []
 *         - cookieAuth: []
 */
router.post("/rooms", releaseVerificationMiddleware, async (req, res) => {
	let token = null;
	try {
		token = await auth.verifyIdToken(req.headers.cookie.split("=")[1]);
	} catch (error) {
		return res.sendStatus(HttpStatus.FORBIDDEN);
	}
	const { err, data } = await getUserByAuthUid(token.uid);
	if (err || !data.key || !data.email) {
		return res.sendStatus(HttpStatus.NOT_FOUND);
	}
	const owner = data.key;
	const members = [data.key];
	const room = await roomCreate(
		req.body.code,
		req.body.description,
		owner,
		members,
		req.body.hidden
	);
	if (!room) return res.sendStatus(HttpStatus.BAD_REQUEST);
	res.json(room);
});
/**
 * @openapi
 * /rooms/all/public:
 *   get:
 *     summary: Endpoint to get public rooms
 *     description: Returns all public rooms
 *     responses:
 *       200:
 *         description: Succes return an array of rooms
 *         content:
 *           application/json:
 *             example:
 *                 value:
 *                   [{"code": "FETCH","description": "TestFetch","members": 0},{"code": "ASDF","description": "sd","members": 0},{"code": "PUSH","description": "PRUEBA","members": 0}]
 *       401:
 *         description: Error Unauthorized user
 *         content:
 *           text/html:
 *             example: error.ejs
 *       404:
 *         description: Error Room not found
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.get(
	"/rooms/all/public",
	releaseVerificationMiddleware,
	async (req, res) => {
		const rooms = await roomGetAllPublic();
		if (!rooms.length) return res.sendStatus(404);
		res.json(rooms);
	}
);

export default router;

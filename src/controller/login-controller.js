import { Router } from "express";
import { releaseVerificationMiddleware } from "./util/login-middleware .js";
import { HttpStatus } from "./util/httpStatus.js";
import { userLogin } from "../model/user-service.js";
const router = Router();
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Endpoint for login
 *     description: Validate access token and assing a cookie
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}
 *     responses:
 *       200:
 *         description: Success login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /rooms
 *       401:
 *         description: Unauthorized and redirect to error view
 *         content:
 *           text/html:
 *             example: error-screen.ejs
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.post("/login", releaseVerificationMiddleware, async (req, res) => {
	const { uid, email } = req.body;
	if (!uid || uid == "") {
		res
			.clearCookie("access_token")
			.status(HttpStatus.NOT_FOUND)
			.json({ url: "/error", status: "error" })
			.end();
		return;
	}
	const { err, data } = await userLogin(uid, email);
	if (err && data.message === "Email not found") {
		res
			.clearCookie("access_token")
			.status(HttpStatus.UNAUTHORIZED)
			.json({ status: "pending" })
			.end();
		return;
	}
	if (err) {
		res
			.clearCookie("access_token")
			.status(HttpStatus.UNAUTHORIZED)
			.json({ url: "/error", status: "error" })
			.end();
		return;
	}
	res.status(HttpStatus.OK).json({ url: "/rooms", status: "success" });
	res.end();
});
/**
 * @openapi
 * /logout:
 *   get:
 *     summary: Endpoint for logout
 *     description: De
 *     responses:
 *       200:
 *         description: Succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /home
 *       401:
 *         description: Unauthorized and redirect to error view
 *         content:
 *           text/html:
 *             example: error-screen.ejs
 */
router.get("/logout", releaseVerificationMiddleware,  (req, res) => {
	res.clearCookie("access_token");
	res.end();
});

router.get("/login/cookie", async (req, res) => {
	if (req.headers.cookie == undefined) {
		res.status(HttpStatus.UNAUTHORIZED).json({ status: "error" });
		return;
	}
	const token = req.headers.cookie.split("=")[1];
	if (token == undefined) {
		res.status(HttpStatus.UNAUTHORIZED).json({ status: "error" });
		return;
	}
	res.status(HttpStatus.OK).json({ status: "success" }).end();
});
export default router;

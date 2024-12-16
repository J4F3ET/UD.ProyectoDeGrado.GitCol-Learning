import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import {HttpStatus} from "./util/httpStatus.js";
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
router.post("/login", releaseVerificationMiddleware, (req, res) => {
	res.status(HttpStatus.OK).json({url: "/rooms"});
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
router.get("/logout", releaseVerificationMiddleware, (req, res) => {
	res.clearCookie("access_token");
	res.end();
});
export default router;

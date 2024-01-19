import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
const router = Router();
/**
 * @openapi
 * /login:
 *   get:
 *     summary: Endpoint para obtener la pantalla de login.
 *     description: Retorna la pantalla de login (login-screen).
 *     responses:
 *       200:
 *         description: Éxito. Retorna la pantalla de login.
 *         content:
 *           text/html:
 *             example: login-screen.ejs
 */
router.get("/login", async (req, res) => {
	res.render("login-screen");
});
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Realiza el proceso de login del usuario utilizando OAuth.
 *     description: Verifica las credenciales del usuario, si el usuario es válido y no posee una cookie de sesión activa, se le asigna una cookie de sesión y se redirige a la pantalla de salas (rooms-screen). Si el usuario ya posee una cookie de sesión activa, se verifica dicho token y se redirige a la pantalla de salas (rooms-screen). Si en cualquiera de los dos casos anteriores es invalida la respuesta retorna un error 401
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}  # Cuerpo vacío, ya que el token se envía en el encabezado o la cookie
 *     responses:
 *       200:
 *         description: Login exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /rooms
 *       401:
 *         description: Token de acceso no válido o ausente.
 *         content:
 *           text/html:
 *             example: login-screen.ejs
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 */
router.post("/login", releaseVerificationMiddleware, (req, res) => {
	res.status(200).json({url: "/rooms"});
	res.end();
});
/**
 * @openapi
 * /logout:
 *   get:
 *     summary: Endpoint para cerrar sesión.
 *     description: Elimina la cookie de sesión del usuario y redirige a la pantalla de login (login-screen).
 *     responses:
 *       401:
 *         description: Éxito. Redirige a la pantalla de login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /login
 */
router.get("/logout", releaseVerificationMiddleware, (req, res) => {
	res.clearCookie("access_token");
	res.render("login-screen");
	res.status(401).json({url: "/login"});
	res.end();
});
export default router;
	
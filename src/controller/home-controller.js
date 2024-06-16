import {Router} from "express";
const router = Router();
/**
 * @openapi
 * /:
 *  get:
 *    summary: Endpoint para obtener la pantalla de inicio.
 *    description: Retorna la pantalla de inicio (home-screen).
 *    responses:
 *     200:
 *      description: Éxito. Retorna la pantalla de inicio.
 *      content:
 *          text/html:
 *             example: home-screen.ejs
 * 
*/
router.get('/', (req, res) => {
	res.render("home-screen");
});
/**
 * @openapi
 * /home:
 *  get:
 *    summary: Endpoint para obtener la pantalla de inicio.
 *    description: Retorna la pantalla de inicio (home-screen).
 *    responses:
 *     200:
 *      description: Éxito. Retorna la pantalla de inicio.
 *      content:
 *          text/html:
 *             example: home-screen.ejs
 * 
*/
router.get('/home', (req, res) => {
	res.redirect("/");
});
export default router;

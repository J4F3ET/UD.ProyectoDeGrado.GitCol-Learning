import {Router} from "express";
const router = Router();
/**
 * @openapi
 * /working:
 *   get:
 *     summary: Endpoint para obtener la pantalla de trabajo.
 *     description: Retorna la pantalla de trabajo (working-screen).
 *     responses:
 *       200:
 *         description: Éxito. Retorna la pantalla de trabajo.
 *         content:
 *           text/html:
 *             example: working-screen.ejs
 */
router.get("/working", (req, res) => {
    res.render("working-screen");
});
export default router;
import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
const router = Router();
/**
 * @openapi
 * /aloneMode:
 *   get:
 *     summary: Endpoint para obtener la pantalla de trabajo en equipo.
 *     description: Retorna la pantalla de trabajo en equipo (alone-mode-screen).
 *     responses:
 *       200:
 *         description: Éxito. Retorna la pantalla de trabajo en equipo.
 *         content:
 *           text/html:
 *             example: alone-mode-screen.ejs
 */
router.get("/aloneMode*",(req, res) => {
    res.render("alone-mode-screen");
});
export default router;
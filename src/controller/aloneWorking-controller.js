import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
const router = Router();
/**
 * @openapi
 * /aloneWorking:
 *   get:
 *     summary: Endpoint para obtener la pantalla de trabajo en equipo.
 *     description: Retorna la pantalla de trabajo en equipo (aloneWorking-screen).
 *     responses:
 *       200:
 *         description: Éxito. Retorna la pantalla de trabajo en equipo.
 *         content:
 *           text/html:
 *             example: aloneWorking-screen.ejs
 */
router.get("/aloneWorking*",(req, res) => {
    res.render("working-alone-screen");
});
export default router;
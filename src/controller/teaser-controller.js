import { Router } from "express";
const router = Router();
/**
 * @openapi
 * /:
 *   get:
 *     summary: Endpoint para obtener la pantalla de avance.
 *     description: Retorna la pantalla de avance (teaser-screen).
 *     responses:
 *       200:
 *         description: Éxito. Retorna la pantalla de avance.
 *         content:
 *           text/html:
 *             example: teaser-screen.ejs
 */
router.get("/", (req, res) => {
    res.render("teaser-screen");
});
export default router;
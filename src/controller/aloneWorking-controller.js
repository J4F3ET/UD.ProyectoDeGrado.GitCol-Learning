import { Router } from "express";
const router = Router();
/**
 * @openapi
 * /aloneMode:
 *   get:
 *     summary: Endpoint render view alone-mode
 *     description: Render view alone-mode
 *     responses:
 *       200:
 *         description: Succes. Render view alone-mode
 *         content:
 *           text/html:
 *             example: alone-mode-screen.ejs
 */
router.get("/aloneMode*",(req, res) => {
    res.render("alone-mode-screen");
});
export default router;
import {Router} from "express";
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
router.get("/aloneMode/:name", async (req, res) => {
    const conceptName = req.params.name;
    console.log(conceptName);
    res.render("alone-mode-screen")
});
export default router;

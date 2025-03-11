import { Router } from "express";
import { getConcept } from "../model/concept-service.js";
const router = Router();
/**
 * @openapi
 * /aloneMode/{name}:
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
    if (!conceptName) return res.sendStatus(404);
	const concept = await getConcept(conceptName);
	if (!concept) return res.sendStatus(404);

	res.render("alone-mode-screen", { concept });
});
export default router;

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

	if (!concept)
		return res.render("alone-mode-screen", {
			concept: {
				challenger: {
					explanation:
						"<br><b>Modo libre (modo por defecto si no encuentra el modo seleccionado)</b><br><br><p> Puedes usar con libertad la consola </p><br>",
				},
			},
			current: "free-mode",
		});
	res.render("alone-mode-screen", { concept, current: conceptName });
});
export default router;

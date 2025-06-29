import { Router } from "express";
import { releaseVerificationMiddleware } from "./util/login-middleware .js";
import { getConcept, getAllKeysConcepts } from "../model/concept-service.js";
import { updateConceptUser, getUserByAuthUid } from "../model/user-service.js";
import { auth } from "../model/firebase-service.js";

const router = Router();
/**
 * @openapi
 * /aloneMode/{name}:
 *   get:
 *     summary: Endpoint render view alone-modea
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
	const conceptsKeys = getAllKeysConcepts();
	const concept = await getConcept(conceptName);

	if (!concept) {
		if (conceptName != "free-mode") return res.redirect("/aloneMode/free-mode");
		if (conceptName == "free-mode")
			return res.render("alone-mode-screen", {
				concept: {
					challenger: {
						explanation:
							"<br><b>Modo libre (modo por defecto si no encuentra el modo seleccionado)</b><br><br><p> Puedes usar con libertad la consola </p><br>",
					},
				},
				current: "free-mode",
				challenges: await conceptsKeys,
			});
	}
	
	res.render("alone-mode-screen", {
		concept,
		current: conceptName,
		challenges: await conceptsKeys,
	});
});
/**
 * @openapi
 * /aloneMode/user/get/concepts:
 *   get:
 *     summary: Endpoint get user concepts
 *     description: Get user concepts
 *     responses:
 *       200:
 *         description: Succes. Return user concepts
 *         content:
 *           application/json:
 *     security:
 *       - BearerAuth: []
 */
router.get(
	"/aloneMode/user/get/concepts",
	releaseVerificationMiddleware,
	async (req, res) => {
		let payload = null;
		try {
			payload = await auth.verifyIdToken(req.headers.cookie.split("=")[1]);
		} catch (error) {
			console.log("❌ Error in aloneMode/user/concepts", error);
			return res.status(500).render("error-screen", {
				error: "Error in aloneMode/user/concepts",
			});
		}
		if (!payload) return res.sendStatus(401);
		const { err, data } = await getUserByAuthUid(payload.uid);
		if (err) {
			console.log("❌ Error in aloneMode/user/concepts", err);
			return res.status(403).render("error-screen", {
				error: "Error in aloneMode/user/concepts",
			});
		}
		if (!data) return res.sendStatus(404);

		res.json({
			concepts: data.concepts,
		});
	}
);

router.post(
	"/aloneMode/user/update/concepts",
	releaseVerificationMiddleware,
	async (req, res) => {
		let payload = null;
		const { concepts } = req.body;
		if (!concepts) return res.sendStatus(400);
		try {
			payload = await auth.verifyIdToken(req.headers.cookie.split("=")[1]);
		} catch (error) {
			console.log("❌ Error in aloneMode/user/update/concepts", error);
			return res.status(500).render("error-screen", {
				error: "Error in aloneMode/user/update/concepts",
			});
		}
		if (!payload) return res.sendStatus(401);
		const { err, data } = await updateConceptUser(payload, concepts);
		if (err) {
			console.log("❌ Error in aloneMode/user/update/concepts", err);
			return res.status(403).render("error-screen", {
				error: "Error in aloneMode/user/update/concepts",
			});
		}
		if (!data) return res.sendStatus(404);
		res.json({
			message: "Concepts updated successfully",
		});
	}
);

export default router;

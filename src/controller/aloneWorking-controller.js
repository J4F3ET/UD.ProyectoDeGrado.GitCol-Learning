import { Router } from "express";
import { releaseVerificationMiddleware } from "./util/login-middleware .js";
import { getConcept } from "../model/concept-service.js";
import { userLogin, getUserByAuthUid } from "../model/user-service.js";
import { auth } from "../model/firebase-service.js";

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
			});
	}
	res.render("alone-mode-screen", { concept, current: conceptName });
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
		let userToken = null;
		try {
			userToken = await auth.verifyIdToken(
				req.headers.authorization.split(" ")[1]
			);
		} catch (error) {
			console.log("❌ Error in aloneMode/user/concepts", error);
			return res.status(500).render("error-screen", {
				error: "Error in aloneMode/user/concepts",
			});
		}
		if (!userToken) return res.sendStatus(401);
		const { err, data } = await userLogin(
			req.headers.authorization.split(" ")[1]
		);
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
		let token = null;
		const { concepts } = req.body;
		if (!concepts) return res.sendStatus(400);
		try {
			token = await auth.verifyIdToken(req.headers.cookie.split("=")[1]);
		} catch (error) {
			console.log("❌ Error in aloneMode/user/update/concepts", error);
			return res.status(500).render("error-screen", {
				error: "Error in aloneMode/user/update/concepts",
			});
		}
		if (!token) return res.sendStatus(401);
		const { err, data: user } = await getUserByAuthUid(token.uid);
		if (err || !user) {
			console.log("❌ Error in aloneMode/user/update/concepts", err);
			return res.status(403).render("error-screen", {
				error: "User not found in aloneMode/user/update/concepts",
			});
		}
		user.concepts = concepts;

		
	}
);

export default router;

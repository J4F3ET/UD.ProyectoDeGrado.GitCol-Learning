import {Router} from "express";
import { getAllKeysConcepts } from "../model/concept-service.js";
const router = Router();
/**
 * @openapi
 * /:
 *  get:
 *    summary: Endpoint for render index view
 *    description: Render index view (home-screen).
 *    responses:
 *     200:
 *      description: Success. Render index view.
 *      content:
 *          text/html:
 *             example: home-screen.ejs
 *
 */
router.get("/", (req, res) => res.render("home-screen"));
/**
 * @openapi
 * /home:
 *  get:
 *    summary: Endpoint for render index view
 *    description: Render index view (home-screen).
 *    responses:
 *     200:
 *      description: Success. Render index view.
 *      content:
 *          text/html:
 *             example: home-screen.ejs
 *
 */
router.get("/home", (req, res) => res.redirect("/"));
/**
 * @openapi
 * /home/concepts:
 *   get:
 *     summary: Endpoint for get all concepts
 *     description: Get all concepts.
 *     responses:
 *       200:
 *         description: Success. Return all concepts.
 *         content:
 *           application/json:
 *             example: { "concepts": ["test-concept", "another-concept"] }
 */
router.get("/home/concepts", async (req, res) => {
	const challenges = await getAllKeysConcepts();
	if (!challenges) return res.sendStatus(404);
	res.json({
		challenges,
	});
});

export default router;

import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import {
	challengeCreate,
	challengeFindByLevel,
} from "../model/challenge-service.js";
const router = Router();
/**
 * @openapi
 * /challenges:
 *   get:
 *     summary: Endpoint para obtener la lista de desafíos de un nivel.
 *     description: |
 *       Retorna la lista de desafíos de un nivel.
 *       Si no se proporciona el nivel, se asume el nivel 0.
 *       Los niveles van de 0 a 2:
 *       - Begginer = 0
 *       - Intermediate = 1
 *       - Advanced = 2
 *     parameters:
 *       - in: query
 *         name: level
 *         required: false
 *         description: Nivel de los desafíos a obtener.
 *           Si no se proporciona, se asume el nivel 0.
 *           Los niveles van de 0 a 2.
 *           - Begginer = 0
 *           - Intermediate = 1
 *           - Advanced = 2
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Éxito. Retorna la lista de desafíos del nivel especificado.
 *         content:
 *           application/json:
 *             example:
 *               "-NnfGdSQazWAwV3xm8kY":
 *                 description: "example2"
 *                 level: "2"
 *                 name: "avanzado"
 *               "-NnfGeUI_qVElq18xeS8":
 *                 description: "example2"
 *                 level: "2"
 *                 name: "avanzado2"
 *               "-NnfGfPnG-Hd7DezKOsl":
 *                 description: "example2"
 *                 level: "2"
 *                 name: "avanzado3"
 *       404:
 *         description: No se encontraron desafíos para el nivel especificado.
 */
router.get("/challenges", async (req, res) => {
	const response =  challengeFindByLevel(req.query.level || 0);
	res.json(await response != null ? (await response).val():{});
});
router.get("/challengesCreate", async (req, res) => {
	const key = challengeCreate(
		req.query.name,
		req.query.description,
		{},
		{},
		req.query.level
	);
	res.json(await key);
});
export default router;
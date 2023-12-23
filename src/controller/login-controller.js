import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
import {ejerciseCreate, ejerciseFindById} from "../model/exercise-service.js";
const router = Router();
router.get("/login", async (req, res) => {
	const idKey = ejerciseCreate("Ejercicio 1", "Ejercicio 1", "Ejercicio 1", "Ejercicio 1");
	//const find = ejerciseFindById("1");
	console.log(await idKey);
	//console.log(await find);
	res.render("login-screen");
});
router.post("/login", releaseVerificationMiddleware, (req, res) => {
	// Agregar Servicio "Verificar si el usuario no se encuentra en una sala"
	res.status(200).json({url: "/rooms"});
	res.end()
});
router.get("/rooms", releaseVerificationMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end()
});
router.get("/logout",releaseVerificationMiddleware, (req, res) => {
	res.clearCookie("access_token");
	res.render("login-screen");
	res.end()
});
export default router;

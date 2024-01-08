import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
const router = Router();
router.get("/login", async (req, res) => {
	res.render("login-screen");
});
router.post("/login", releaseVerificationMiddleware, (req, res) => {
	// Agregar Servicio "Verificar si el usuario no se encuentra en una sala"
	res.status(200).json({url: "/rooms"});
	res.end();
});

router.get("/logout", releaseVerificationMiddleware, (req, res) => {
	res.clearCookie("access_token");
	res.render("login-screen");
	res.status(401).json({url: "/login"});
	res.end();
});
export default router;
	
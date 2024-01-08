import {Router} from "express";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
const router = Router();
router.get("/rooms", releaseVerificationMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end();
});
router.get("/challenges",(req,res) =>{
	console.log(req.query.level);
	const level = req.query.level;
});
export default router;

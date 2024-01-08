import {Router} from "express";
import { <link
			rel="shortcut icon"
			href="./dist/assets/fav-icon.ico"
			type="image/x-icon"
		/> } from "../model/room-service.js";
import {releaseVerificationMiddleware} from "./util/login-middleware .js";
const router = Router();
router.get("/rooms", releaseVerificationMiddleware, (req, res) => {
	res.render("rooms-screen");
	res.end();
});
router.get("/challenges",(req,res) =>{
	
});
export default router;

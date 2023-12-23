import {Router} from "express";
const router = Router();
router.get("/home", (req, res) => {
	res.render("home-screen");
});
export default router;

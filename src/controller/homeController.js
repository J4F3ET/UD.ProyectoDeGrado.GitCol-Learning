import {Router} from "express";
const router = Router();
router.get("/home", (req, res) => {
	res.render("screen-home");
});
export default router;

import {Router} from "express";
import {verifyIdTokenMiddleware} from "./util/middleware .js";
const router = Router();
router.post("/login", (req, res) => {

});
router.get("/login",verifyIdTokenMiddleware,(req, res) => {
	console.log("Authorized");
	res.send("ok");
});
router.get("/logout", (req, res) => {

});
export default router;

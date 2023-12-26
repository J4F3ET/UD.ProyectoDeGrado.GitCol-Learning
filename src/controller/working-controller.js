import {Router} from "express";
const router = Router();
router.get("/working", (req, res) => {
    res.render("working-screen");
});
export default router;
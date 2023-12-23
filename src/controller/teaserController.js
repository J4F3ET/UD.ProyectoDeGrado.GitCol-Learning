import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
    res.render("screen-teaser");
});
export default router;
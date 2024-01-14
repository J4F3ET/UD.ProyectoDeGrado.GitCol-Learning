import { Router } from "express";
const router = Router();
router.get("/teamWorking*", (req, res) => {
    res.render("teamWorking-screen", { room: req.query.room });
});
export default router;
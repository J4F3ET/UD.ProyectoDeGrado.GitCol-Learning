import { Router } from "express";

import {database} from "../model/db/conn";
const router = Router();

router.get("/", (req, res) => {
    res.render("teaser");
});

export default router;
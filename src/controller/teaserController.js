import { Router } from "express";

import {database} from "../model/db/conn";
const router = Router();

router.get("/", (req, res) => {
    database.ref("hola").once("value", (snapshot) => {
       res.send("Hello World!" + snapshot.val());
    });
});

export default router;
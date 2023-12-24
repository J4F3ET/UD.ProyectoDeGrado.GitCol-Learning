import {Router} from "express";
const router = Router();
import {
	roomCreate,
	roomDelete,
	roomGet,
	roomGetAll,
	roomUpdate,
} from "../model/room-service";
router.get("/roomCreate", (req, res) => {
	roomCreate("uayie", "description", "owner", [1, 2], 1, true, [], []).then(
		(id) => {
			res.send("roomCreate: " + id);
		}
	);
});
router.get("/roomDelete/:id", (req, res) => {
    roomDelete(req.params.id).then(() => {
        res.send("roomDelete: " + id);
    });
});
router.get("/roomGet/:id", (req, res) => {
    roomGet(req.params.id).then((room) => {
            const data = room.val();
            console.log(data);
			res.json(data);
		});
});
router.get("/roomGetAll", (req, res) => {
    roomGetAll().then((rooms) => {
        const data = rooms.val();
        res.json(data);
    });
});
export default router;

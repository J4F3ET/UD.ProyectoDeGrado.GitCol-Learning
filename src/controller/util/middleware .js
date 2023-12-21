import {auth} from "../../model/firebaseService.js";
export const verifyIdTokenMiddleware = async (req, res, next) => {
	const token = req.headers["authorization"].split(" ")[1];
	const user = await auth.verifyIdToken(token);
	if (!user) {
		console.log("Unauthorized");
		res.status(401);
		res.render("teaser", {message: "Unauthorized"})
		return;
	}
	next();
};

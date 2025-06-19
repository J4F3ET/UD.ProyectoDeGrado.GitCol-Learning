import { findByUserToRoom, roomGet } from "../../model/room-service.js";
import { getUserByAuthUid } from "../../model/user-service.js";
import { CustomError } from "../../model/CustomError.js";
import { auth } from "../../model/firebase-service.js";
import { errorMiddleware } from "./error-middleware.js";
import { HttpStatus } from "./httpStatus.js";
// Middleware Express: Funciones que se ejecutan antes de que lleguen a las rutas
export const verifyUserInAnyRoomMiddleware = async (req, res, next) => {
	try {
		const token = await auth.verifyIdToken(req.headers.cookie.split("=")[1]);
		const { err, data } = await getUserByAuthUid(token.uid);
		if (err || !data) {
			const error = new CustomError("User not found", HttpStatus.NOT_FOUND);
			return errorMiddleware(error, req, res, next);
		}
		const dataSnaptshot = findByUserToRoom(data.key);
		if ((await dataSnaptshot).length != 0) {
			res.redirect(`/teamWorking?room=${(await dataSnaptshot)[0]}`);
		} else {
			next();
		}
	} catch (error) {
		errorMiddleware(error, req, res, next);
	}
};
export const verifyUserInRoomMiddleware = async (req, res, next) => {
	try {
		const token = await auth.verifyIdToken(req.headers.cookie.split("=")[1]);
		if (!token) throw new Error("Token not found");
		const dataSnaptshot = roomGet(req.query.room);
		const room = await dataSnaptshot;
		const { err, data } = await getUserByAuthUid(token.uid);
		if (!room.val() || err || !data) throw new Error("Room or user not found");
		if (!room.val().members.includes(data.key)) throw new Error("Unauthorized");
		next();
	} catch (error) {
		const err = new CustomError("Unauthorized", HttpStatus.UNAUTHORIZED);
		errorMiddleware(err, req, res, next);
	}
};

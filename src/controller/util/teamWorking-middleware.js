import { findByUserToRoom,roomGet } from "../../model/room-service.js";
import { CustomError } from "../../model/CustomError.js";
import {auth} from "../../model/firebase-service.js";
import { errorMiddleware } from "./error-middleware.js";
// Middleware Express: Funciones que se ejecutan antes de que lleguen a las rutas 
export const verifyUserInAnyRoomMiddleware = async (req, res, next) => {
    try {
        const data = auth.verifyIdToken(req.headers.cookie.split("=")[1])
        const dataSnaptshot = findByUserToRoom((await data).uid);
        if ((await dataSnaptshot).length != 0) {
            res.redirect(`/teamWorking?room=${(await dataSnaptshot)[0]}`);
        }else{
            next();
        }
    } catch (error) {
        errorMiddleware(error, req, res, next);
    }
    
}
export const verifyUserInRoomMiddleware = async (req, res, next) => {
    try {
        const data =  auth.verifyIdToken(req.headers.cookie.split("=")[1])
        const dataSnaptshot = roomGet(req.query.room);
        const user = await data;
        const room = await dataSnaptshot;
        if(!(room.val()  && user))
            throw new Error("Unauthorized");
        if(!room.val().members.includes(user.uid))
            throw new Error("Unauthorized");
        next();
    } catch (error) {
        const err = new CustomError("Unauthorized",401);
        errorMiddleware(err, req, res, next);
    }
}
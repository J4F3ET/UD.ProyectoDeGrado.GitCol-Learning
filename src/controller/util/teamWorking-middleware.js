import { findByUserToRoom } from "../../model/room-service.js";
import {auth} from "../../model/firebase-service.js";
export const verifyUserInAnyRoomMiddleware = async (req, res, next) => {
    const data =  auth.verifyIdToken(req.headers.cookie.split("=")[1])
    const dataSnaptshot = findByUserToRoom((await data).uid);
    if ((await dataSnaptshot).length != 0) {
        res.redirect(`/teamWorking?room=${(await dataSnaptshot)[0]}`);
    }else{
        next();
    }
}
export const verifyUserInRoomMiddleware = async (req, res, next) => {
    const data =  auth.verifyIdToken(req.headers.cookie.split("=")[1])
    const dataSnaptshot = findByUserToRoom((await data).uid);
    if ((await dataSnaptshot).length == 0) {
        res.redirect("/rooms");
    }else{
        next();
    }
    
}
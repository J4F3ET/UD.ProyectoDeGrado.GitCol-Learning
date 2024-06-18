import { findByUserToRoom,roomGet } from "../../model/room-service.js";
import {auth} from "../../model/firebase-service.js";
// Middleware Express: Funciones que se ejecutan antes de que lleguen a las rutas 
export const verifyUserInAnyRoomMiddleware = async (req, res, next) => {
    const data = auth.verifyIdToken(req.headers.cookie.split("=")[1])
    const dataSnaptshot = findByUserToRoom((await data).uid);
    if ((await dataSnaptshot).length != 0) {
        res.redirect(`/teamWorking?room=${(await dataSnaptshot)[0]}`);
    }else{
        next();
    }
}
export const verifyUserInRoomMiddleware = async (req, res, next) => {
    if(req.query.room == undefined) {
        res.redirect("/rooms");
        return;
    };
    const data =  auth.verifyIdToken(req.headers.cookie.split("=")[1])
    const dataSnaptshot = roomGet(req.query.room);
    const user = await data;
    const room = await dataSnaptshot;
    if(!(room.val()  && user)){
        res.redirect("/rooms");
        return;
    }
    if(!room.val().members.includes(user.uid)){
        res.redirect("/rooms");
        return;
    }else{
        next();
    }
    
}
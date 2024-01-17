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
    const data =  auth.verifyIdToken(req.headers.cookie.split("=")[1])
    const dataSnaptshot = findByUserToRoom((await data).uid);
    if ((await dataSnaptshot).length == 0) {
        res.redirect("/rooms");
    }else{
        next();
    }
    
}
// Middleware Socket.io: Funciones que se ejecutan antes de que lleguen a las conexiones
export const verifyUrl = async =>(socket, next) => {
    console.log(socket);
    // const url = socket.request.url;
    // const room = url.split("=")[1];
    // const roomSnapshot = roomGet(room);
}
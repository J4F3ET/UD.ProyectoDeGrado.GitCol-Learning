import {auth} from "../model/firebase-service.js";
import {
    roomGet,
	roomGetByCode,
    roomUpdate
} from "../model/room-service.js";
export class SocketHandler {
    constructor(io){
        this._io = io;
        io.on('connect', (socket) => {
            // Middleware
            io.use(this.verifyUrl);
            const room = socket.request.headers.referer.split("=")[1];
            if (undefined === room)
                return Error("Room not found");
            //Events
            this.addSocketToRoom(room,socket);
            this.setupSocketEvents(room,socket);
            console.log('Connected to server');
        });
    }
    verifyUrl = (socket, next) => {
        const room = socket.request.headers.referer.split("=")[1];
        const cookie = socket.request.headers.cookie.split("=")[1];
        if(room == undefined || cookie == undefined){
            next(new Error("Room not found in url or user not logged in"));
            return;
        }
        auth.verifyIdToken(cookie).then((data) => {
            roomGet(room).then((_room) => {
                if(_room.val().members.includes(data.uid)){
                    next();
                }else{
                    next(new Error("Member not found in room"));
                }
            }).catch((error) => {
                next(new Error(error,"User not found in room"));
            });
        }).catch((error) => {
            next(new Error(error,"User not found in room"));
        });
    }
    async updateRepository(data){
        const room = await roomGetByCode(this.roomCode);
        if (room === null)
            return Error("Room not found");
        console.log("Room found: ", room);
        
    }
    async setupSocketEvents(room,socket){
        socket.on('disconnect', () => {
            this.removeSocketFromRoom(room, socket);
        });
        socket.on('updateRepository', (args) => {
            this.updateSocketRepository(socket,args)
        });
    };
    async addSocketToRoom(room,socket){
        socket.join(room);
        this._io.to(room).emit('message', 'Teagregamos a '+ room);
    };
    async removeSocketFromRoom(room,socket){
        socket.leave(room);
    }
    async updateSocketRepository(socket,data){
        console.log("Updating repository");
        socket.emit('message', data);
    }
}

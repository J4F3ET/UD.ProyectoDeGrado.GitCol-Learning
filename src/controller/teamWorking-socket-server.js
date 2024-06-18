import {auth} from "../model/firebase-service.js";
import {
    roomGet,
	roomGetByCode,
    roomUpdateRepository,
    observeRoom,
} from "../model/room-service.js";
export class SocketHandler {
    constructor(io){
        this.server = io;
        io.on('connect', (client) => {
            // Middleware
            io.use(this.verifyUrl);
            const room = client.request.headers.referer.split("=")[1];
            if (undefined === room)
                return Error("Room not found");
            //Events
            this.addSocketToChannel(room,client);
            this.setupSocketEvents(room,client);
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
    async setupSocketEvents(channel,socket){
        socket.on('disconnectToChannel', () => {
            this.removeSocketFromChannel(channel, socket);
        });
        socket.on('updateRepository', (args) => {
            this.updateSocketRepository(channel,args)
        });
    };
    async addSocketToChannel(channel,socket){
        socket.join(channel);
        this.server.to(channel).emit('message', 'Teagregamos a '+ channel);
    };
    async removeSocketFromChannel(channel,socket){
        console.log('Socket desconectado de '+ channel);
        socket.leave(channel);
        socket.emit('disconnectToChannel', 'Te sacamos de '+ channel);
    }
    async updateRepository(room,data){
        const roomDTO = await roomGetByCode(room);
        if (roomDTO === null)
            return Error("Room not found");
        roomUpdateRepository(roomDTO.key, {repository: data});
    }
    async updateSocketRepository(room,data){
        this.updateRepository(room,data);
        this.sendUpdateToChannel(room);
    }
    async sendUpdateToChannel(room){
        observeRoom(room, (data) => {
            this.server.to(room).emit('updateRepository', data);
        });
    }
}

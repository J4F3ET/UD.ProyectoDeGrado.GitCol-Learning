import {auth} from "../model/firebase-service.js";
import {
    roomGet,
	roomGetByCode,
    roomUpdateCommitsToRepository,
    observeRoom,
} from "../model/room-service.js";
export class SocketHandler {
    constructor(io){
        this.server = io;
        // Middleware
        io.use(this.verifyUrl);
        io.on('connect', (client) => {
            const room = client.request.headers.referer.split("=")[1];
            //Events
            this.addSocketToChannel(room,client);
            this.setupSocketEvents(room,client);
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
            const data = JSON.parse(args);
            if(!data.hasOwnProperty('commits'))
                return Error("Commits not found");
            this.updateSocketRepository(channel,data);
        });
    };
    async addSocketToChannel(channel,socket){
        socket.join(channel);
    };
    async removeSocketFromChannel(channel,socket){
        socket.leave(channel);
    };
    async updateSocketRepository(channel,data){
        roomUpdateCommitsToRepository(channel, data);
        this.sendUpdateRepositoryToChannel(channel);
    };
    async sendUpdateRepositoryToChannel(channel){
        observeRoom(channel, (data) => {
            this.server.to(channel).emit('updateRepository', data);
        });
    };
}

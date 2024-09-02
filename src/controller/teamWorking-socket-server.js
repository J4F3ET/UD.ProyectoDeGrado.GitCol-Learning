import {auth} from "../model/firebase-service.js";
import {
    roomGet,
    roomUpdateCommitsToRepository,
    observeRoom,
} from "../model/room-service.js";
import { parseToCommitObject } from "../model/utils.js";
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
    verifyUrl = async (socket, next) => {
        try {
            const room = socket.request.headers.referer.split("=")[1];
            const cookie = socket.request.headers.cookie.split("=")[1];
            if(room == undefined || cookie == undefined)
                throw new Error("Room not found in url or user not logged in");
            const responseToken = await auth.verifyIdToken(cookie);
            const responseRoom = await roomGet(room);
            if(responseToken == undefined)
                throw new Error("User not logged in");
            if(responseRoom == null)
                throw new Error("Room not found");
            if(!responseRoom.val().members.includes(responseToken.uid))
                throw new Error("Member not found in room");
            next();
        } catch (error) {
            next(error);
        }
    }
    async setupSocketEvents(channel,socket){
        socket.on('disconnectToChannel', () => {
            this.removeSocketFromChannel(channel, socket);
        });
        socket.on('updateRepository', (args) => {
                if(args == undefined){
                    socket.emit('error', 'Invalid data');
                    return;
                }
                this.updateSocketRepository(channel,args);
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
        observeRoom(channel, async (data) => {
            if(!data) return
            this.server.to(channel).emit(
                'updateRepository',
                await Promise.all(data.repository.commits.map(parseToCommitObject))
            );
        });
    };
}

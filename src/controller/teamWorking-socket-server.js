import { auth } from "../model/firebase-service.js";
import {
	roomGet,
	roomUpdateCommitsToRepository,
	observeRoom,
} from "../model/room-service.js";
import { parseToCommitObject } from "../model/utils.js";
import { getUserByAuthUid } from "../model/user-service.js";
export class SocketHandler {
	constructor(io) {
		console.log("✅ SocketHandler initialized...");
		// Middleware
		this.server = io;
		io.use(this.verifyUrl);
		io.on("connection", (client) => {
			console.log("New client connected", client.id);
			const room = client.request.headers.referer.split("=")[1];
			//Events
			this.addSocketToChannel(room, client);
			this.setupSocketEvents(room, client);
		});
	}
	verifyUrl = async (socket, next) => {
		try {
			const room = socket.request.headers.referer.split("=")[1];
			if (room == undefined) throw new Error("Room not found in url");
			const cookie = socket.request.headers.cookie.split("=")[1];
			if (cookie == undefined)
				throw new Error("Cookie not found in request headers");
			const responseToken = await auth.verifyIdToken(cookie);
			if (responseToken == undefined) throw new Error("User not logged in");
			const responseRoom = await roomGet(room);
			if (responseRoom == null) throw new Error("Room not found");
			const { err, data } = await getUserByAuthUid(responseToken.uid);
			if (err || !data) throw new Error("User not found");
			if (!responseRoom.val().members.includes(data.key))
				throw new Error("Member not found in room");
			next();
		} catch (error) {
			console.log(
				"❌ SocketHandler Error verifying URL or user authentication:",
				error.message
			);
			socket.emit("error", error.message);
			next(error);
		}
	};
	async setupSocketEvents(channel, socket) {
		socket.on("disconnectToChannel", () => {
			this.removeSocketFromChannel(channel, socket);
		});
		socket.on("updateRepository", (args) => {
			if (args == undefined) {
				socket.emit("error", "Invalid data");
				return;
			}
			this.updateSocketRepository(channel, args);
		});
	}
	async addSocketToChannel(channel, socket) {
		socket.join(channel);
	}
	async removeSocketFromChannel(channel, socket) {
		socket.leave(channel);
	}
	async updateSocketRepository(channel, data) {
		roomUpdateCommitsToRepository(channel, data);
		this.sendUpdateRepositoryToChannel(channel);
	}
	async sendUpdateRepositoryToChannel(channel) {
		observeRoom(channel, async (data) => {
			if (!data) return;
			this.server
				.to(channel)
				.emit(
					"updateRepository",
					await Promise.all(data.repository.commits.map(parseToCommitObject))
				);
		});
	}
}

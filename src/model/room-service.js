import { database } from "./firebase-service.js";
import { defaultRepository } from "./utils.js";
/**
 * roomCreate - Create a new room
 * @param {string} code : code of the room
 * @param {string} description : description of the room
 * @param {string} owner : owner of the room
 * @param {List<int>} members : members of the room
 * @param {boolean} status : status of the room
 * @param {boolean} hidden : hidden status of the room
 * @returns {Promise<int>} : id of the room
 */
async function roomCreate(
	code,
	description,
	owner,
	members,
	hidden,
	status = true
) {
	let key = null;
	try {
		key = database.ref("rooms/").push({
			code,
			description,
			owner,
			members,
			status,
			hidden,
		}).key;
	} catch (error) {
		console.error(error);
		return null;
	}
	roomUpdateRepository(key, defaultRepository(key));
	return key;
}
/**
 * roomUpdateRepository - Update the repository of a room
 * @param {string} id : id of the room
 * @param {Promise} data : object with the params to update
 * @returns {Promise<void>}
 */
async function roomUpdateRepository(id, data) {
	try {
		const ref = database.ref("rooms/" + id + "/repository");
		ref.set(await data).key;
	} catch (error) {
		console.error(error);
	}
}
/**
 * roomUpdate - Update a room
 * @param {string} id : id of the room
 * @param {Map<String,Object} mapParams : object with the params to update
 * @returns {Promise<int>} : id of the room
 */
async function roomUpdate(id, mapParams) {
	const refString = "rooms/" + id + "/";
	try {
		mapParams.forEach((value, key) => {
			database.ref(refString + key).set(value);
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function roomUpdateStatus(id, data) {
	try {
		const ref = database.ref("rooms/" + id + "/status");
		return ref.set(data).key;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function roomUpdateCommitsToRepository(id, data) {
	try {
		const ref = database.ref(`/rooms/${id}/repository/commits`);
		return ref.set(data).key;
	} catch (error) {
		console.error(error);
		return null;
	}
}
/**
 * roomDelete - Delete a room
 * @param {string} id : id of the room
 */
async function roomDelete(id) {
	try {
		return database.ref("rooms/" + id).remove();
	} catch (error) {
		return null;
	}
}
/**
 * roomGet - Get a room
 * @param {string} id : id of the room
 * @returns {Promise<object>} : room
 */
async function roomGet(id) {
	try {
		return database.ref("rooms/" + id).get();
	} catch (error) {
		return null;
	}
}
/**
 * roomGetAll - Get all rooms
 * @returns {Promise<object>} : rooms
 */
async function roomGetAll() {
	try {
		return database.ref("rooms/").get();
	} catch (error) {
		return null;
	}
}
/**
 * roomGetAllPublic - Get all public rooms
 * @throws error
 * @returns {Promise<[{id: string, code: string, description: string, members: int}]|[]>} : rooms public or empty array
 */
async function roomGetAllPublic() {
	try {
		const response = await database
			.ref("rooms/")
			.orderByChild("hidden")
			.equalTo(false)
			.get();
		const rooms = response.val();
		if (!rooms) return [];
		return Object.keys(rooms)
			.filter((roomId) => rooms[roomId].status == true)
			.map((roomId) => {
				return {
					code: rooms[roomId].code,
					description: rooms[roomId].description,
					members: rooms[roomId].members?.length || 0,
				};
			});
	} catch (error) {
		console.error(error);
		return [];
	}
}
/**
 *
 * @param {string} idUser
 * @returns data of the rooms
 * @throws error
 */
async function findByUserToRoom(idUser) {
	try {
		const roomsSnapshot = database.ref("rooms").get();
		const rooms = (await roomsSnapshot).val();
		if (!rooms) return [];
		const roomsWithUser = Object.keys(rooms).filter((roomId) => {
			const members = rooms[roomId].members || [];
			return members.includes(idUser);
		});
		return roomsWithUser;
	} catch (error) {
		console.error(error);
		return [];
	}
}
async function roomGetByCode(code) {
	try {
		const roomsSnapshot = database.ref("rooms").get();
		const rooms = (await roomsSnapshot).val();
		if (!rooms) return null;
		const room = Object.keys(rooms).find(
			(roomId) => rooms[roomId].code === code
		);
		return room === undefined ? null : room;
	} catch (error) {
		console.error(error);
		return null;
	}
}
async function roomRemoveMember(roomKey, userId) {
	try {
		const roomSnapshot = database.ref("rooms/" + roomKey).get();
		const room = (await roomSnapshot).val();
		if (!room) return false;
		const members = room.members || [];
		const newMembers = members.filter((member) => member !== userId);
		await database.ref("rooms/" + roomKey).update({ members: newMembers });
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
async function roomAddMember(roomKey, userId) {
	try {
		const roomSnapshot = database.ref("rooms/" + roomKey).get();
		const room = (await roomSnapshot).val();
		if (!room || !room.status) return false;
		const members = room.members || [];
		const newMembers = members.concat(userId);
		await database.ref("rooms/" + roomKey).update({ members: newMembers });
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
async function observeRoom(roomKey, callback) {
	try {
		database.ref("rooms/" + roomKey).on("value", (snapshot) => {
			const room = snapshot.val();
			callback(room);
		});
	} catch (error) {
		console.error(error);
	}
}
export {
	roomCreate,
	roomUpdate,
	roomUpdateStatus,
	roomUpdateCommitsToRepository,
	roomDelete,
	roomGet,
	roomGetAll,
	roomGetAllPublic,
	findByUserToRoom,
	roomRemoveMember,
	roomAddMember,
	roomGetByCode,
	observeRoom,
};

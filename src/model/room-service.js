import {database} from "./firebase-service";
/**
 * roomCreate - Create a new room
 * @param {string} code : code of the room
 * @param {string} description : description of the room
 * @param {string} owner : owner of the room
 * @param {List<int>} members : members of the room
 * @param {string} challenge : id of the challenge
 * @param {boolean} status : status of the room
 * @param {List<object>} chat : record of the chat
 * @param {List<object>} record : record of the code
 * @param {boolean} hidden : hidden status of the room
 * @param {int} level : challenge level
 * @returns {Promise<int>} : id of the room
 */
async function roomCreate(code, description,owner, members, challenge, status, chat, record,hidden,level) {
    try{
        return database.ref("rooms/").push({
            code,
            description,
            owner,
            members,
            challenge,
            status,
            chat,
            record,
            hidden,
            level
        }).key;
    }catch(error){
        console.error(error);
        return null;
    }
	
}
/**
 * roomUpdate - Update a room
 * @param {string} id : id of the room
 * @param {string} code : code of the room
 * @param {string} description : description of the room
 * @param {string} owner : owner of the room
 * @param {List<int>} members : members of the room
 * @param {int} challenge : id of the challenge
 * @param {boolean} status : status of the room
 * @param {List<object>} chat : record of the chat
 * @param {List<object>} record : record of the code
 * @param {boolean} hidden : hidden status of the room
 * @param {int} level : level challenge
 * @returns {Promise<int>} : id of the room
 */
async function roomUpdate(id,code, description,owner, members, challenge, status, chat, record,hidden,level) {
    return database.ref("rooms/"+id).set({
        code,
        description,
        owner,
        members,
        challenge,
        status,
        chat,
        record,
        hidden,
        level
    }).key;
}
/**
 * roomDelete - Delete a room
 * @param {string} id : id of the room
 */
async function roomDelete(id) {
    return database.ref("rooms/"+id).remove();
}
/**
 * roomGet - Get a room
 * @param {string} id : id of the room
 * @returns {Promise<object>} : room
*/
async function roomGet(id) {
    return database.ref("rooms/"+id).get();
}
/**
 * roomGetAll - Get all rooms
 * @returns {Promise<object>} : rooms
*/
async function roomGetAll() {
    return database.ref("rooms/").get();
}
async function findByUserToRoom(idUser) {
    try {
        const roomsSnapshot = database.ref("rooms").get();
        const rooms = (await roomsSnapshot).val();
        if (!rooms) return [];
        const roomsWithUser = Object.keys(rooms).filter(roomId => {
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
        const room = Object.keys(rooms).find(roomId => rooms[roomId].code === code);
        return room === undefined ? null : room;
    } catch (error) {
        console.error(error);
        return null;
    }
};
async function roomRemoveMember(roomKey, userId) {
    try {
        const roomSnapshot = database.ref("rooms/"+roomKey).get();
        const room = (await roomSnapshot).val();
        if (!room) return false;
        const members = room.members || [];
        const newMembers = members.filter(member => member != userId);
        await database.ref("rooms/"+roomKey).update({members: newMembers});
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
async function roomAddMember(roomKey, userId) {
    try {
        const roomSnapshot = database.ref("rooms/"+roomKey).get();
        const room = (await roomSnapshot).val();
        if (!room) return false;
        const members = room.members || [];
        const newMembers = members.concat(userId);
        await database.ref("rooms/"+roomKey).update({members: newMembers});
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
export {
    roomCreate, 
    roomUpdate, 
    roomDelete, 
    roomGet,
    roomGetAll,
    findByUserToRoom,
    roomRemoveMember,
    roomAddMember,
    roomGetByCode
}
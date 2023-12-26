import {database} from "./firebase-service";
/**
 * roomCreate - Create a new room
 * @param {string} code : code of the room
 * @param {string} description : description of the room
 * @param {string} owner : owner of the room
 * @param {List<int>} members : members of the room
 * @param {int} challenge : id of the challenge
 * @param {boolean} status : status of the room
 * @param {List<object>} chat : record of the chat
 * @param {List<object>} record : record of the code
 * @returns {Promise<int>} : id of the room
 */
async function roomCreate(code, description,owner, members, challenge, status, chat, record) {
	return database.ref("rooms/").push({
        code,
        description,
        owner,
        members,
        challenge,
        status,
        chat,
        record
	}).key;
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
 * @returns {Promise<int>} : id of the room
 */
async function roomUpdate(id,code, description,owner, members, challenge, status, chat, record) {
    return database.ref("rooms/"+id).set({
        code,
        description,
        owner,
        members,
        challenge,
        status,
        chat,
        record
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
export {roomCreate, roomUpdate, roomDelete, roomGet, roomGetAll}
import {database} from "./firebase-service";
async function challengeCreate(name, description, generator, solution, level) {
	return database.ref("challenges/").push({
		name,
		description,
		generator,
		solution,
		level,
	}).key;
}
/**
 * challengeFindById - Find an challenge by id
 * @param {string} id: id of the challenge
 * @returns Promise<DataSnapshot>
 */
async function challengeFindById(id) {
	return database
		.ref("challenges/" + id)
		.limitToFirst(1)
		.get();
}
/**
 * challengeFindAll - Find all challenges
 * @returns Promise<DataSnapshot>
 */
async function challengeFindAll() {
	try {
		return database.ref("challenges/").limitToFirst(10).get();
	} catch (error) {
		console.error(error);
		return null;
	}
	
}
async function challengeFindByLevel(level) {
	try {
		return database.ref("challenges/").orderByChild("level").equalTo(level).once('value');
	} catch (error) {
		console.error(error);
		return null;
	}
}

export {
	challengeCreate,
	challengeFindById,
	challengeFindAll,
	challengeFindByLevel,
};

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
	return database.ref("challenges/").limitToFirst(10).get();
}
async function challengeFindByLevel(level) {
	var promise = {}
	try {
		promise = database
			.ref("challenges/")
			.get();
	} catch (error) {
		console.log("error en la bda");
	}
	return promise;
}

export {
	challengeCreate,
	challengeFindById,
	challengeFindAll,
	challengeFindByLevel,
};

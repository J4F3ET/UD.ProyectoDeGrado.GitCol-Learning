import {database} from "./firebase-service";
async function exerciseCreate(name, description, generator, solution) {
	return database.ref("challenges/").push({
		name: name,
		description: description,
		generator: generator,
		solution: solution,
	}).key;
}
/**
 * exerciseFindById - Find an exercise by id
 * @param {string} id: id of the challenge
 * @returns Promise<DataSnapshot>
 */
async function exerciseFindById(id) {
	return database.ref("challenges/"+id).get();
}
/**
 * exerciseFindAll - Find all exercises
 * @returns Promise<DataSnapshot>
 */
async function exerciseFindAll() {
	return database.ref("challenges/").get();
}
export {exerciseCreate, exerciseFindById, exerciseFindAll};
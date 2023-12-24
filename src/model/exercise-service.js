import {database} from "./firebase-service";
import {ref, set, onValue, off} from "firebase-admin/database";
class Exercise {
	constructor(id, name, description, generator, solution) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.generator = generator;
		this.solution = solution;
	}
}
export async function exerciseCreate(name, description, generator, solution) {
	return database.ref("exercises/").push({
		name: name,
		description: description,
		generator: generator,
		solution: solution,
	}).key;
}
export async function exerciseFindById(id) {
	return new Promise((resolve, reject) => {
		onValue(ref(database, `exercises/${id}`), (snapshot) => {
			const exercise = snapshot.val();
			if (exercise) {
				resolve(
					new Exercise(
						id,
						ejercise.name,
						ejercise.description,
						ejercise.generator,
						ejercise.solution
					)
				);
			} else {
				console.log("No data available");
				resolve(null);
			}
		});
	});
}

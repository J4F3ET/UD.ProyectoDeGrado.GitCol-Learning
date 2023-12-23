import {database} from "./firebase-service";
import {ref, set, onValue, off} from "firebase-admin/database";
class Ejercise {
	constructor(id, name, description, generator, solution) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.generator = generator;
		this.solution = solution;
	}
}
export async function ejerciseCreate(name, description, generator, solution) {
	return database.ref("ejercises/").push({
		name: name,
		description: description,
		generator: generator,
		solution: solution,
	}).key;
}
export async function ejerciseFindById(id) {
	return new Promise((resolve, reject) => {
		onValue(ref(database, `ejercises/${id}`), (snapshot) => {
			const ejercise = snapshot.val();
			if (ejercise) {
				resolve(
					new Ejercise(
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

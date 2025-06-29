import { database } from "./firebase-service.js";

export const getConcept = async (key) => {
	try {
		const snapshot = await database.ref("concepts/" + key).once("value");
		return snapshot.val();
	} catch (error) {
		console.error(error);
		return null;
	}
};
export const getAllKeysConcepts = async () => {
	try {
		const snapshot = await database.ref("concepts").once("value");
		return Object.keys(snapshot.val() || {});
	} catch (error) {
		console.error(error);
		return [];
	}
}

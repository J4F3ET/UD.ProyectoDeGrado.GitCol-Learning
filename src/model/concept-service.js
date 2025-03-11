import { database } from "./firebase-service";

export const getConcept = async (key) => {
	try {
		const snapshot = await database.ref("concepts/" + key).once("value");
		return snapshot.val();
	} catch (error) {
		console.error(error);
		return null;
	}
};

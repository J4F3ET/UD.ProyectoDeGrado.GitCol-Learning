import { auth } from "../firebase-config.js";

// Guarda la respuesta de la pregunta
export const conceptKeySessionStorage = "concept";
export const saveConcept = async (response) => {
	const logs =
		getElementSessionStorage("log")?.filter((log) => log.tag == "comand") ?? [];
	const newConcept = createNewConcept(response, logs);
	const { auth } = await import("../firebase-config.js");

	const concepts = getConcepts(auth.currentUser?.uid ?? "");
	const newConcepts = createNewConcepts(newConcept, concepts);
	saveResponseInSessionStorage(auth.currentUser?.uid ?? "", newConcepts);
	saveResponseInDatabase(newConcepts, auth);
};
const getElementSessionStorage = (key) => {
	return JSON.parse(sessionStorage.getItem(key)) || null;
};
const createNewConcept = (response, logs) => {
	return {
		...response,
		log: logs,
	};
};
const createNewConcepts = (newConcept, concepts) => {
	return concepts.find((c) => c.concept == newConcept.concept)
		? concepts.map((c) => (c.concept == newConcept.concept ? newConcept : c))
		: [...concepts, newConcept];
};
const getConcepts = (uid = "") => {
	return getElementSessionStorage(uid + conceptKeySessionStorage) || [];
};
const saveResponseInSessionStorage = async (uid = "", concepts) => {
	if (!concepts || concepts.length === 0) return;
	sessionStorage.setItem(
		uid + conceptKeySessionStorage,
		JSON.stringify(concepts)
	);
};
const saveResponseInDatabase = async (concepts, auth) => {
	if (!concepts || concepts.length === 0 || !auth || !auth.currentUser) return;
	const config = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ concepts }),
	};
	fetch("/aloneMode/user/update/concepts", config);
};
const getConceptDataBase = async () => {
	const config = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};
	const response = await fetch("/aloneMode/user/get/concepts", config);
	const data = await response.json();
	return response.ok ? data.concepts : null;
};
export const loginConcept = async (uid) => {
	if (!uid) return;
	const conceptDataBase = await getConceptDataBase();
	const concept = getElementSessionStorage(conceptKeySessionStorage);
	const conceptsMerged = mergeConcepts(conceptDataBase, concept || []) || [];
	sessionStorage.setItem(
		uid + conceptKeySessionStorage,
		JSON.stringify(conceptsMerged)
	);
	sessionStorage.removeItem(conceptKeySessionStorage);
};
const mergeConcepts = (conceptsDatabase, conceptsSession) => {
	if (!conceptsDatabase || !conceptsSession) return conceptsSession;
	const mergedConcepts = [...conceptsDatabase];
	conceptsSession.forEach((sessionConcept) => {
		const index = mergedConcepts.findIndex(
			(dbConcept) => dbConcept.concept === sessionConcept.concept
		);
		if (index !== -1) {
			mergedConcepts[index] = sessionConcept;
		} else {
			mergedConcepts.push(sessionConcept);
		}
	});
	return mergedConcepts;
};
export const clearConceptsSessionStorage = (uid) => {
	const uidd = uid || auth.currentUser?.uid || null;
	uidd ? sessionStorage.removeItem(uid + conceptKeySessionStorage) : null;
	sessionStorage.removeItem(conceptKeySessionStorage);
};

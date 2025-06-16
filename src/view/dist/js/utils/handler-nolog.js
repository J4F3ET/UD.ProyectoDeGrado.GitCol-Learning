// Guarda la respuesta de la pregunta
export const saveConcept = async (response) => {
	const { auth } = await import("../firebase-config.js");
	const logs =
		getElementSessionStorage("log")?.filter((log) => log.tag == "comand") ?? [];
	const newConcept = getNewConcept(response, logs);
	const concepts = getElementSessionStorage("concept") || [];
	const newConcepts = getNewConcepts(newConcept, concepts);
	sessionStorage.setItem("concept", JSON.stringify(newConcepts));
	if (auth.currentUser) {
		saveResponseInDatabase(newConcepts);
	}
};
const getElementSessionStorage = (key) => {
	return JSON.parse(sessionStorage.getItem(key)) || null;
};
const getNewConcept = (response, logs) => {
	return {
		...response,
		log: logs,
	};
};
const getNewConcepts = (newConcept, concepts) => {
	return concepts.find((c) => c.concept == newConcept.concept)
		? concepts.map((c) => (c.concept == newConcept.concept ? newConcept : c))
		: [...concepts, newConcept];
};
const saveResponseInDatabase = async (concepts) => {
	
}
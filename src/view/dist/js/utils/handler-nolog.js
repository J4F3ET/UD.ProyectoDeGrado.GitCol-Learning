// Guarda la respuesta de la pregunta
export const saveConcept = async (response) => {
	const logs =
		getElementSessionStorage("log")?.filter((log) => log.tag == "comand") ?? [];
	const newConcept = getNewConcept(response, logs);
	const { auth } = await import("../firebase-config.js");
	let concepts = getElementSessionStorage("concept") || [];
	if (auth.currentUser && concepts.length === 0) {
		concepts = await loadUserConcepts();
	}
	const newConcepts = getNewConcepts(newConcept, concepts);
	sessionStorage.setItem("concept", JSON.stringify(newConcepts));
	saveResponseInDatabase(newConcepts, auth);
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
const loadUserConcepts = async () => {
	const config = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};
	const response = await fetch("/aloneMode/user/get/concepts", config);
	const data = await response.json();
	if (data?.concepts) {
		console.log("Concepts loaded from database:", data.concepts);
		sessionStorage.setItem("concept", JSON.stringify(data.concepts));
		return data.concepts;
	}
	return [];
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

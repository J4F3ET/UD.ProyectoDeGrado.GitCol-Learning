// Guarda la respuesta de la pregunta

export const saveConcept = async (response) => {
	const { auth } = await import("../firebase-config.js");
	saveResponse(response, auth.currentUser);
	saveChanllengerLog(auth.currentUser);
};
const saveResponse = async (response, user = null) => {
	if (!user) saveResponseInSessionStorage(response);
	else saveResponseInDatabase(response);
};
const saveChanllengerLog = async (user = null) => {
	const log = await getElementSessionStorage("log");
	if (!user) saveLogInSessionStorage(log);
	else saveChallengerLogInDatabase(log);
};
// Database
const saveChallengerLogInDatabase = async (log) => {
	console.log("saveChallengerLogInDatabase");
};
const saveResponseInDatabase = async (response) => {
	console.log("saveResponseInDatabase");
};
//  Session storage
const getElementSessionStorage = async (element) => {
	return JSON.parse(sessionStorage.getItem(element));
};
const setElementSessionStorage = async (element, value) => {
	if (await getElementSessionStorage(element)) return;
	sessionStorage.setItem(element, JSON.stringify(value));
};
const saveConceptInSessionStorage = async (concept) => {
	setElementSessionStorage("concept", concept);
};
const getConceptSessionStorage = async () => {
	const conceptObject = await getElementSessionStorage("concept");
	return conceptObject ? conceptObject : createConceptSessionStorage();
};
const createConceptSessionStorage = async (
	concept = {
		question: "",
		challenger: {
			log: [],
		},
	}
) => {
	setElementSessionStorage("concept", concept);
	return concept;
};
export const saveLogInSessionStorage = async (logConsole = []) => {
	const conceptUser = await getConceptSessionStorage();
	conceptUser.challenger.log =
		logConsole.length == 0 ? logConsole : await getElementSessionStorage("log");
	saveConceptInSessionStorage(conceptUser);
};
export const saveResponseInSessionStorage = async (response) => {
	const conceptUser = await getConceptSessionStorage();
	conceptUser.question = response;
	saveConceptInSessionStorage(conceptUser);
};

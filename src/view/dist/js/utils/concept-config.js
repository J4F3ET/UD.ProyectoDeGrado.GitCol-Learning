import { logConceptChallenge } from "../mode-script.js";
export const changeConcept = async (concept) => {
	if (!concept) return;
	changeChallengeConcept(concept.challenger);
	changeQuestionConcept(concept.question);
};
const changeChallengeConcept = async (challenger) => {
	const { explanation, steps, log } = challenger;
	clearExplanation();
	changeAllCommandsConcept(steps);
	changeAllLogsConcept([{ message: explanation, tag: "explanation" }, ...log?? []]);
};
const changeAllLogsConcept = async (logs) => {
	if (!logs) return;
	logs.forEach((log) => changeLogConcept(log));
};
const changeLogConcept = async ({ tag, message }) => {
	if (!message) return;
	logConceptChallenge(tag, message);
};
const changeAllCommandsConcept = async (steps) => {
	if (!steps) return;
	steps.forEach((step) => changeCommandConcept(step));
};
const changeCommandConcept = async (command) => {
	const input = document.getElementById("comandInput");
	input.value = command;
	input.dispatchEvent(
		new KeyboardEvent("keyup", { key: "Enter", keyCode: 13 })
	);
};
const clearExplanation = async () => {
	const log = JSON.parse(sessionStorage.getItem("log"));
	if (!log) return;
	const newLog = log.filter((log) => log.tag !== "explanation");
	sessionStorage.setItem("log", JSON.stringify(newLog));
};
//Esto se debe activar al momento de querer salir o de cambiar de reto
const changeQuestionConcept = async (question) => {};

// Esto cambia la url deacuerdo ala option seleccionada


document.getElementById("select_concept").addEventListener("change", (e) => {
	const option = e.target.options[e.target.selectedIndex];
	if (!option) return;
	changeUrlConcept(option.value);
})

const changeUrlConcept = async (option) => {
	const urlParts = window.location.href.split("/");
	const baseUrl = urlParts.slice(0, -1).join("/");
	const newUrl = `${baseUrl}/${option}`;
	const url = new URL(newUrl);
	window.location.href = url;
};
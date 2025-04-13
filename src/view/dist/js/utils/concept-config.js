import { logConceptChallenge } from "../mode-script.js";
import { openDialogQuestion } from "../dialogs/dialog-question-concept-script.js";
import { saveConcept } from "./handler-nolog.js";
export const changeConcept = async (concept) => {
	if (!concept || !concept?.challenger) return;
	changeChallengeConcept(concept.challenger);
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

// Esto cambia la url deacuerdo ala option seleccionada

document.getElementById("select_concept").addEventListener("change", async (e) => {
	const option = e.target.options[e.target.selectedIndex];
	if (!option || !option?.value) return;
	const { url, beforeUrl } = await changeUrlConcept(option.value);
	if (beforeUrl == "free-mode") return (window.location.href = url);
	const response = await openDialogQuestion();
	if(!response) return changeCancelConcept(beforeUrl);
	await saveConcept({ concept: beforeUrl, response })
	window.location.href = url;
})

const changeCancelConcept = async (newSelected) => {
	const idSelect = "select_concept";
	const selectedOption = await findSelectedOption(idSelect);
	const newSelectedOption = await findSelectedOptionByValue(idSelect, newSelected);
	if (!selectedOption || !newSelectedOption) return;
	
	selectedOption.selected = false;
	newSelectedOption.selected = true;
}

const findSelectedOption = async (idSelect) => {
	const select = document.getElementById(idSelect);
	if (!select) return;
	const selectedOption = select.options[select.selectedIndex];
	return selectedOption;
}

const findSelectedOptionByValue = async (idSelect,value) => {
	const select = document.getElementById(idSelect);
	if (!select || !select?.options) return;
	const selectedOption = [...select.options].find((option) => option.value === value);
	return selectedOption;
}

const changeUrlConcept = async (option) => {
	const urlParts = window.location.href.split("/");
	const baseUrl = urlParts.slice(0, -1).join("/");
	const newUrl = `${baseUrl}/${option}`;
	const url = new URL(newUrl);

	return {url,beforeUrl: urlParts[urlParts.length - 1]}	
};
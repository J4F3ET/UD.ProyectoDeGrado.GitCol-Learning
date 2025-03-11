import { driveUsageMode } from "./drivejs-mode-script.js";
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document
	.getElementById("btnExit")
	.addEventListener("click", async () => (window.location.href = "/"));
document.getElementById("btnTutorial").addEventListener("click", async () =>
	driveUsageMode({
		element: "#svg",
		popover: {
			title: "Command visualization",
			description:
				"In this section you will see a graphical representation of the commands you have executed.",
			side: "left",
			align: "start",
		},
	}).drive()
);
window.onload = async () => {
	await changeConcept();
};
const changeConcept = async (btn) => {
	if (!CONCEPT) return;
	console.log(CONCEPT);
	changeChallengerConcept(CONCEPT.challenger);
	changeQuestionConcept(CONCEPT.question);
};
const changeChallengerConcept = async (challenger) => {
	const { logs, steps } = challenger;
	changeAllCommandsConcept(steps);
	changeAllLogsConcept(logs);
};
const changeAllLogsConcept = async (logs) => {
	if (!logs) return;
	logs.forEach((log) => changeLogConcept(log));
};
const changeLogConcept = async (log) => {
	const { tag, message } = log;
	const logContainer = document.getElementById("logContainer");
	const logParagraph = document.createElement("p");
	logParagraph.innerText = message;
	switch (tag) {
		case "comand":
			break;
		case "error":
			logParagraph.classList.add("error");
			break;
		case "info":
			logParagraph.classList.add("help");
			break;
		default:
			return;
	}
	logContainer.appendChild(logParagraph);
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
//Esto se debe activar al momento de querer salir o de cambiar de reto
const changeQuestionConcept = async (question) => {};

// Handle login and logout buttons
const btnDisable = async (btn) => {
	btn.disabled = true;
	btn.style.display = "none";
};
const btnEnable = async (btn) => {
	btn.disabled = false;
	btn.style.display = "block";
};
const resolveBtnLogin = async (user) => {
	if (user) {
		btnDisable(document.getElementById("btn_login"));
		btnEnable(document.getElementById("btnLogout"));
	} else {
		btnEnable(document.getElementById("btn_login"));
		btnDisable(document.getElementById("btnLogout"));
	}
};

onAuthStateChanged(auth, async (user) => resolveBtnLogin(user));

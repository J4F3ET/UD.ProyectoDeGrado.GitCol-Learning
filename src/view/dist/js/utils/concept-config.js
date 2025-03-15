import { driverQuestionsChallenger } from "../drivejs-mode-script.js";
import { logConceptChallenge } from "../mode-script.js";
document.getElementById("btnTest").addEventListener("click", async () => {
    driverQuestionsChallenger(
        ["A", "B", "C", "D", "E"],
        "What is the capital of Spain?",
        "Question"
    ).drive();
});
export const changeConcept = async (concept) => {
    if (!concept) return;
    const statusChangeConcept = sessionStorage.getItem("statusChangeConcept");
    if (statusChangeConcept) return;
	changeChallengeConcept(concept.challenger);
	changeQuestionConcept(concept.question);
    sessionStorage.setItem("statusChangeConcept", 1);
};
const changeChallengeConcept = async (challenger) => {
    const { explanation, steps, log } = challenger;
    changeAllCommandsConcept(steps);
    changeAllLogsConcept([{ message: explanation,tag: "explanation" }, ...log]);
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
//Esto se debe activar al momento de querer salir o de cambiar de reto
const changeQuestionConcept = async (question) => {};

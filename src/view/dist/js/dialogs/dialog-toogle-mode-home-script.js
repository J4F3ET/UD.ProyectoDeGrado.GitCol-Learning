import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
let userExist = false;
let loadChallenges = false;
onAuthStateChanged(auth, async (user) => (userExist = user ? true : false));
const dialogSelectMode = document.querySelector("#dialogSelectMode");
const dialog = document.getElementById("dialogSelectMode");
// Toogle mode
const loadChallengesFetch = async () => {
	if (loadChallenges) return; // Evita cargar varias veces
	const response = fetch("/home/concepts"); // Ajusta el endpoint si es necesario
	const select = document.getElementById("select_concept");
	const freeModeOption = document.createElement("option");
	freeModeOption.value = 'free-mode';
	freeModeOption.textContent = "Free mode";
	select.appendChild(freeModeOption); // Añade la opción de modo libre
	const challenges = (await (await response).json()).challenges || [];
	if (!challenges || challenges.length === 0) return;
	challenges.forEach((challenge) => {
		const option = document.createElement("option");
		option.value = challenge;
		option.textContent = challenge.replace(/-/g, " "); // opcional: mejor presentación
		option.textContent = option.textContent.charAt(0).toUpperCase() + option.textContent.slice(1);
		select.appendChild(option);
	});
	loadChallenges = true;
};
const toogleImage = async (mode) => {
	const otherImage = mode === "single" ? "multi" : "single";
	document.getElementById(`img_cat_${mode}`).style.display = "block";
	document.getElementById(`img_cat_${otherImage}`).style.display = "none";
};
const toogleText = async (mode) => {
	const otherText = mode === "single" ? "Single mode" : "Multi mode";
	document.querySelector(".dialog_block_course").innerHTML = otherText;
};
const toogleMode = async (mode) => {
	await toogleImage(mode);
	await toogleText(mode);
};
const toogleModeCallback = async () => {
	dialog.dataset.mode = dialog.dataset.mode === "single" ? "multi" : "single";
	if (userExist && dialog.dataset.mode === "multi") unlockDialog("multi");
	else if (dialog.dataset.mode === "multi") lockDialog("multi");
	else unlockDialog("single");
	toogleMode(dialog.dataset.mode);
};
const lockDialog = async (mode) => {
	const img = document.getElementById(`img_cat_${mode}`);
	const btn = document.getElementById("btn_select_mode");
	const dialog_span = document.getElementById("dialog_span");

	dialog_span.classList.add("lock");
	dialog_span.classList.remove("unlock");

	img.classList.add("lock");
	img.classList.remove("unlock");

	btn.classList.add("lock");
	btn.classList.remove("unlock");
	btn.setAttribute("disabled", true);
};
const unlockDialog = async (mode) => {
	const img = document.getElementById(`img_cat_${mode}`);
	const btn = document.getElementById("btn_select_mode");
	const dialog_span = document.getElementById("dialog_span");

	dialog_span.classList.remove("lock");
	dialog_span.classList.add("unlock");

	img.classList.remove("lock");
	img.classList.add("unlock");

	btn.classList.remove("lock");
	btn.classList.add("unlock");
	btn.removeAttribute("disabled");
};
const closeDialog = async () => {
	dialogSelectMode.close();
};
// Open dialog select mode
document.querySelectorAll(".btn-dialog").forEach((element) => {
	element.addEventListener("click", async () => {
		loadChallengesFetch();
		dialogSelectMode.showModal();
	});
});
document.querySelectorAll(".btn_dialog_coursel").forEach((btn) => {
	btn.addEventListener("click", async () => await toogleModeCallback());
});
// Close dialog select mode
document
	.getElementById("btn_select_mode")
	.addEventListener("click", async () => await closeDialog());
document
	.getElementById("btn_close_select_mode")
	.addEventListener("click", async () => await closeDialog());

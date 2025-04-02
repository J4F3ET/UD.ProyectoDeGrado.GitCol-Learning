const dialog_question = document.querySelector("#dialog_question");
document.getElementById("btnTest")?.addEventListener("click", async () => {
	openDialogQuestion();
});
document
	.getElementById("btn_close_question")
	.addEventListener("click", async () => await closeDialogQuestion());
const openDialogQuestion = async () => {
	console.log(dialog_question);
	dialog_question.showModal();
};
const closeDialogQuestion = async () => {
	dialog_question.close();
};

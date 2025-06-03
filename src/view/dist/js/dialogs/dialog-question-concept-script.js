const dialog_question = document.querySelector("#dialog_question");
const buttons_dialog_question = document.querySelectorAll(
	"#dialog_question .btn_question"
);
export const openDialogQuestion = async () => {
	dialog_question.showModal();
	return await new Promise((resolve) => {
		buttons_dialog_question.forEach((btn) => {
			btn.addEventListener("click", async () => resolve(await resolveDialog()));
		});
	});
};

const resolveDialog = async () => {
	dialog_question.close();
	return await responseSelect();
};
const responseSelect = async () => {
	const selected = document.querySelector(
		'input[name="question-options"]:checked'
	);
	return selected ? selected.id : null;
};

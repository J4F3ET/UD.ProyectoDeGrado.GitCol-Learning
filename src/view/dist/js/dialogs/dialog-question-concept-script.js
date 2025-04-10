const dialog_question = document.querySelector("#dialog_question");
document.getElementById("btnTest")?.addEventListener("click", async () => {
	openDialogQuestion();
});

export const openDialogQuestion = async () => {
	dialog_question.showModal();
	return await new Promise((resolve) => {
		document
			.getElementById("btn_answer_question")
			.addEventListener("click", () => {
				dialog_question.close();
				resolve();
			});
		document
			.getElementById("btn_cancel_question")
			.addEventListener("click", () => {
				dialog_question.close();
				resolve(null);
			});
		document
			.getElementById("btn_close_question")
			.addEventListener("click", async () => {
				dialog_question.close();
				resolve(null);
			});
	});
};

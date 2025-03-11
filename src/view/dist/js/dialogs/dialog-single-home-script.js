const startAloneMode = async (mode) => {
	const url = new URL(window.location.href + "aloneMode/" + mode);
	window.location.href = url.toString();
};
const openDialogSingle = async () => {
	console.log(document.getElementById("dialogSelectMode").dataset.mode);
	if (document.querySelector("[data-mode]").dataset.mode !== "single") return;
	document.getElementById("dialog_single").showModal();
};
const closeDialogSingle = async () => {
	document.getElementById("dialog_single").close();
};
document
	.getElementById("btn_select_mode")
	.addEventListener("click", async () => await openDialogSingle());
document
	.getElementById("btn_close_single")
	.addEventListener("click", async () => await closeDialogSingle());
document
	.getElementById("btn_start_alone_mode")
	.addEventListener("click", async () => {
		const mode = document.getElementById("select_concept").value;
		if (mode === "") return;
		await startAloneMode(mode);
	});

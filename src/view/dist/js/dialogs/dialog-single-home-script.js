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

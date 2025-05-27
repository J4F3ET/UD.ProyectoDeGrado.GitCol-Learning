const openDialogMulti = async () => {
	if (document.querySelector("[data-mode]").dataset.mode !== "multi") return;
	console.log("Opening dialog multi home");
	window.location.href = "/rooms";
};
const closeDialogMulti = async () => {
	document.getElementById("dialog_multi").close();
};
document
	.getElementById("btn_select_mode")
	.addEventListener("click", async () => await openDialogMulti());
// document
// 	.getElementById("btn_close_multi")
// 	.addEventListener("click", async () => await closeDialogMulti());

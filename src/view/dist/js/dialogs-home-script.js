const dialogSelectMode = document.querySelector("#dialogSelectMode");
const buttonSelectMode = document.getElementById("btn_select_mode");
const openButtonDialog = document.querySelectorAll(".btn-dialog");
const closeButtonDialog = document.querySelectorAll(".close_dialog");
const courseButtons = document.querySelectorAll(".btn_dialog_coursel");
const modeElement = document.querySelector("[data-mode]");
const getImgInforOfMode = async (mode) => {
	const imgElement = document.createElement("img");
	const path = `dist/assets/img/home/${
		mode == "single" ? "cat_white.png" : "cats.png"
	}`;
	imgElement.classList.add("img_cat", mode == "single" ? "single" : "multi");
	imgElement.setAttribute("loading", "lazy");
	imgElement.setAttribute("src", path);
	imgElement.setAttribute(
		"alt",
		mode == "single" ? "Single user mode" : "Multi user mode"
	);
	return imgElement;
};
const getItemDialog = (icon, text) => {
	const item = document.createElement("div");
	const iconElement = document.createElement("div");
	const textElement = document.createElement("small");
	item.classList.add("item_dialog");
	iconElement.classList.add("icon_item_dialog");
	textElement.classList.add("tex_item_dialog");
	iconElement.innerHTML = `<i class='${icon}'></i>`;
	textElement.innerHTML = text;
	item.appendChild(iconElement);
	item.appendChild(textElement);
	return item;
};
const getCourseInforOfMode = async (mode) => {
	return mode === "single" ? "Single user mode" : "Multi user mode";
};
async function toogleMode(mode) {
	const newImageElement = getImgInforOfMode(mode);
	const newCourseText = getCourseInforOfMode(mode);
	const imgElement = dialogSelectMode.querySelector(".img_cat");
	dialogSelectMode
		.querySelector(".dialog_block_img")
		.replaceChild(await newImageElement, imgElement);
	dialogSelectMode.querySelector(".dialog_block_course").innerHTML =
		await newCourseText;
}
const toogleModeCallback = async () => {
	toogleMode(modeElement.dataset.mode);
	modeElement.dataset.mode =
		modeElement.dataset.mode === "single" ? "multi" : "single";
};
const selectModeCallback = async (mode) => {
	const idDialog = `dialog_${mode === "single" ? "multi" : "single"}`;
	dialogSelectMode.close();
	document.getElementById(idDialog).showModal();
};
const closeDialogCallback = async (dialogId) => {
	document.getElementById(dialogId)?.close();
};

openButtonDialog.forEach((element) => {
	element.addEventListener("click", async () => {
		toogleMode(modeElement.dataset.mode === "single" ? "multi" : "single");
		dialogSelectMode.showModal();
	});
});
courseButtons.forEach((btn) => {
	btn.addEventListener("click", async () => toogleModeCallback());
	// btn.addEventListener(
	//     'touchstart',
	//     async () => toogleModeCallback()
	// );
});
closeButtonDialog.forEach((btn) => {
	btn.addEventListener("click", async (e) =>
		closeDialogCallback(e.target.dataset.dialog)
	);
	// btn.addEventListener(
	//     'touchstart',
	//     async (e) => closeDialogCallback(e.target.dataset.dialog)
	// );
});
buttonSelectMode.addEventListener("click", async () =>
	selectModeCallback(modeElement.dataset.mode)
);
// buttonSelectMode.addEventListener(
//     'touchstart',
//     async () => selectModeCallback(modeElement.dataset.mode)
// );

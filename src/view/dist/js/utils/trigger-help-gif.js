const getImgElement = (command) => {
	const img = document.createElement("img");
	img.src = `../dist/assets/gif/git-${command}.gif`;
	img.alt = "representation of git " + command;
	img.fetchPriority = "high";
	img.style.maxWidth = "100%";
	img.style.height = "auto";
	img.style.borderRadius = "12px";
	return img;
};
export const helpGifs = async (command) => {
	if (!command) return;
	const imageElement = getImgElement(command);
	Swal.fire({
		title: "🚀 git " + command,
		html: imageElement.outerHTML,
		color: "var(--text-color)",
		background: "var(--bg-color)",
		confirmButtonText: "Close",
		showCloseButton: true,
		customClass: {
			popup: "help-gif-alert",
			confirmButton: "btn red",
		},
	});
};

const loadCss = async (url) => {
	if (!!document.querySelector(`link[rel="stylesheet"][href="${url}"]`)) return;
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = url;
	document.head.appendChild(link);
};
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
	await loadCss("../dist/css/sweetAlert/help-gif-style.css");
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

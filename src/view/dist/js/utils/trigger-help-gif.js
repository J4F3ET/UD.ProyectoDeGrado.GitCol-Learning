const loadCss = async (url) => {
	if (!!document.querySelector(`link[rel="stylesheet"][href="${url}"]`)) return;
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = url;
	document.head.appendChild(link);
};

export const helpGifs = async (command) => {
	if (!command) return;
	await loadCss("../dist/css/sweetAlert/help-gif-style.css");
	Swal.fire({
		title: "🚀 git " + command, 
		html:
			'<img src="../dist/assets/gif/git-' +
			command +
			'.gif" alt="ayuda"  style="max-width: 100%; height: auto; border-radius: 12px;" />',
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

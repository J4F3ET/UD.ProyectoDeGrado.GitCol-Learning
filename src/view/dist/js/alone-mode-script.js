window.addEventListener("load", () => {
	setTimeout(async () => {
		const { changeConcept } = await import("./utils/concept-config.js");
		changeConcept(CONCEPT).then(async () => {
			const { observer } = await import("./mode-script.js");
			observer.notify(sessionStorage.getItem(REF_STORAGE_LOG));
		});
	}, 250); // Delay to ensure the page is fully loaded
});
document
	.getElementById("btnExit")
	.addEventListener("click", async () => (window.location.href = "/"));
document.getElementById("btnTutorial").addEventListener("click", async () => {
	const { driveUsageMode } = await import("./drivejs-mode-script.js");
	driveUsageMode({
		element: "#svg",
		popover: {
			title: "Command visualization",
			description:
				"In this section you will see a graphical representation of the commands you have executed.",
			side: "left",
			align: "start",
		},
	}).drive();
});

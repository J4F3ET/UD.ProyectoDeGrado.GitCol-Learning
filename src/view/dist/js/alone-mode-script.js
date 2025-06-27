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

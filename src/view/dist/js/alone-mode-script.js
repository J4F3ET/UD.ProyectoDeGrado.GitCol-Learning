import { driveUsageMode } from "./drivejs-mode-script.js";
import { changeConcept } from "./utils/concept-config.js";
import { observer } from "./mode-script.js";

window.addEventListener("load", () => {
	changeConcept(CONCEPT);
	observer.notify(sessionStorage.getItem(REF_STORAGE_LOG));
});
document
	.getElementById("btnExit")
	.addEventListener("click", async () => (window.location.href = "/"));
document.getElementById("btnTutorial").addEventListener("click", async () =>
	driveUsageMode({
		element: "#svg",
		popover: {
			title: "Command visualization",
			description:
				"In this section you will see a graphical representation of the commands you have executed.",
			side: "left",
			align: "start",
		},
	}).drive()
);
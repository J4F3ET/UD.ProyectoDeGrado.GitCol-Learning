import { driveUsageMode } from "./drivejs-mode-script.js";
import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
document.getElementById("btnExit").addEventListener("click", () => {
	window.location.href = "/";
});
document.getElementById("btnTutorial").addEventListener("click", () => {
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


// Handle login and logout buttons
const btnDisable = async (btn) => {
	btn.disabled = true;
	btn.style.display = "none";
};
const btnEnable = async (btn) => {
	btn.disabled = false;
	btn.style.display = "block";
};
const resolveBtnLogin = async (user) => {
	if (user) {
		btnDisable(document.getElementById("btn_login"));
		btnEnable(document.getElementById("btnLogout"));
	} else {
		btnEnable(document.getElementById("btn_login"));
		btnDisable(document.getElementById("btnLogout"));
	}
};

onAuthStateChanged(auth, async (user) => resolveBtnLogin(user));

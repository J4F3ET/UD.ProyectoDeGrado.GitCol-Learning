import { auth } from "../firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Handle login and logout buttons
const btnDisable = async (btn) => {
	btn.disabled = true;
	btn.style.display = "none";
};
const btnEnable = async (btn) => {
	btn.disabled = false;
	btn.style.display = "inline";
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
document
	.getElementById("btnLogout")
	.addEventListener("click", async () => auth.signOut());
onAuthStateChanged(auth, async (user) => resolveBtnLogin(user));

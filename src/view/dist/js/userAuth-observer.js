import {auth} from "./firebase-config.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
export async function logout() {
	auth.signOut();
	return fetch("/logout", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	});
}
onAuthStateChanged(auth, (user) => {
	if (user) return;
	logout().then((response) => {
		if (response.status !== 401) return;
		response.json().then((data) => {
			window.location.href = data.url;
		});
	});
});

import {auth} from "./firebase-config.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
export async function logout() {
	const response = fetch("/logout", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	});
	auth.signOut();
	return response;
}
onAuthStateChanged(auth, (user) => {
	if (user) return;
	logout().then((response) => {
		response.json().then((data) => {
			window.location.href = data.url;
		});
	});
});

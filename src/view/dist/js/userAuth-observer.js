import {auth} from "./firebase-config.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
export async function logout() {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	const promise = fetch("/logout", {
		method: "GET",
		headers: headers,
	});
	auth.signOut();
	return promise;
}
onAuthStateChanged(auth, async (user) => {
	if (user) return;
	logout();
	window.location.href = "/login";
});

import {auth} from "./firebase-config.js";
export async function logout() {
	const response = fetch("/logout", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	auth.signOut();
	return response;
}
export async function goToHome() {
	window.location.href = "/";
}

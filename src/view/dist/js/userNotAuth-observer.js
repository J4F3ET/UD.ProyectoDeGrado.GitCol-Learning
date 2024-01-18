import {auth} from "./firebase-config.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
export async function login(user) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Authorization", `Bearer ${user.accessToken}`);
	return fetch("/login", {
		method: "POST",
		headers: headers,
	});
}
onAuthStateChanged(auth, async (user) => {
	if (!user) return;
	const response = await login(user);
	const responseJson = response.json();
	if (response.status === 200) {
		window.location.href = (await responseJson).url;
	}
});

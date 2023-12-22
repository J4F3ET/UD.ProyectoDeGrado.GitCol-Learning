import {googleAuthProvider, githubAuthProvider, auth} from "./firebase.js";
import {
	signInWithPopup,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
document.getElementById("googleLogin").addEventListener("click", async () => {
	login((await signInWithPopup(auth, googleAuthProvider)).user);
});
document.getElementById("githubLogin").addEventListener("click", async () => {
	login((await signInWithPopup(auth, githubAuthProvider)).user);
});
document.getElementById("logout").addEventListener("click", async () => {
	auth.signOut();
});
async function login(user) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Authorization", `Bearer ${user.accessToken}`);
	return fetch("/login", {
		method: "POST",
		headers: headers,
	});
}
onAuthStateChanged(auth,async (user) => {
	if (!user) return;
	const response = await login(user);
	if (response.status === 200) {
		window.location.href = "/rooms";
	}
});

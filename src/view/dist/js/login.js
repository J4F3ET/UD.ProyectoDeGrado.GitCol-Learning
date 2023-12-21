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
	const response = auth.signOut();
	console.log(await response);
});
async function login(user) {
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Authorization", `Bearer ${user.accessToken}`);
	fetch("/login", {
		method: "GET",
		headers: headers,
	});
}
onAuthStateChanged(auth, (user) => {
	if (user) login(user);
});

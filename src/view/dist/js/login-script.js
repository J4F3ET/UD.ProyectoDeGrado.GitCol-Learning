import {
	signInWithPopup,
	onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
	googleAuthProvider,
	githubAuthProvider,
	microsoftAuthProvider,
	auth,
} from "./firebase-config.js";
const HttpStatusErrorMessage = {
	400: "Error in request, please try again later",
	401: "Verification failed, please try again later",
	403: "Access denied, please try again later",
	404: "Not found user, please try again later",
	500: "Internal server error, please try again later",
};
const login = async (user) => {
	if (!user || !user.uid || !user.accessToken)
		return alertError("User not found");
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Authorization", `Bearer ${user.accessToken}`);
	const response = await fetch("/login", {
		method: "POST",
		headers: headers,
		body: JSON.stringify({ uid: user.uid }),
	});
	if (!response.ok)
		alertError(
			HttpStatusErrorMessage[response.status] ?? HttpStatusErrorMessage[500]
		);
};
const alertError = (message) =>
	Swal.fire({
		position: "center",
		icon: "error",
		title: message,
		showConfirmButton: false,
		timer: 1500,
	});
const authProvider = async (provider) => {
	const dataAuthProvider = await signInWithPopup(auth, provider);
	if (!dataAuthProvider || !dataAuthProvider.user)
		alertError("Error in login, try again later");
	await login(dataAuthProvider.user);
};
document
	.getElementById("googleLogin")
	.addEventListener(
		"click",
		async () => await authProvider(googleAuthProvider)
	);
document
	.getElementById("githubLogin")
	.addEventListener(
		"click",
		async () => await authProvider(githubAuthProvider)
	);
document
	.getElementById("microsoftLogin")
	.addEventListener(
		"click",
		async () => await authProvider(microsoftAuthProvider)
	);

// onAuthStateChanged(auth, async (user) => {
// 	if (!user) return;
// 	await login(user);
// });

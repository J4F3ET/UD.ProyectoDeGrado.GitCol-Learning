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
let loginState = false;
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
	loginState = true;
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Authorization", `Bearer ${user.accessToken}`);
	const response = await fetch("/login", {
		method: "POST",
		headers: headers,
		body: JSON.stringify({ uid: user.uid, email: user.email }),
	});
	const data = await response.json();
	if (!response.ok && data.status === "error") {
		auth.signOut();
		alertError(HttpStatusErrorMessage[response.status]);
	}
	if (!response.ok && data.status === "pending") alertNeedToEmail(user);
	loginState = false;
};
const alertNeedToEmail = (user) =>
	Swal.fire({
		title: "Need to verify your email",
		input: "text",
		inputAttributes: {
			autocapitalize: "off",
		},
		showCancelButton: true,
		confirmButtonText: "Confirmed",
		showLoaderOnConfirm: true,
		allowOutsideClick: () => !Swal.isLoading(),
	}).then(async (result) => {

		if (!result.isConfirmed){
			await auth.signOut();
			return;
		};
		user.email = result.value;
		await login(user);
	});
const alertError = (message) =>
	Swal.fire({
		position: "center",
		icon: "error",
		title: message,
		showConfirmButton: false,
		timer: 1500,
	});

export const sesionExpired = () =>{
	if (loginState) return;
	Swal.fire({
		title: "Session expired",
		text: "Please login again",
		icon: "warning",
		showCancelButton: true,
		showLoaderOnConfirm: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes, login",
	}).then((result) => {
		if (result.isConfirmed) {
			login();
		} else {
			auth.signOut();
		}
	});
}
const closeDialog = async () => {
	const dialog_login = document.querySelector("#dialog_login");
	if (dialog_login) dialog_login.close();
};
const authProvider = async (provider) => {
	closeDialog();
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

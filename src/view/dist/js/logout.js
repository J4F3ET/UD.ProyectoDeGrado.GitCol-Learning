import {googleAuthProvider, githubAuthProvider, auth} from "./firebase.js";
document.getElementById("logout").addEventListener("click", async () => {
	const response = auth.signOut();
	console.log(await response);
});

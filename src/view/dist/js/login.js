import {googleAuthProvider, githubAuthProvider, auth} from "./firebase.js";
import {signInWithPopup} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {login} from "./userNotAuthObserver.js";
document.getElementById("googleLogin").addEventListener("click", async () => {
	login((await signInWithPopup(auth, googleAuthProvider)).user);
});
document.getElementById("githubLogin").addEventListener("click", async () => {
	login((await signInWithPopup(auth, githubAuthProvider)).user);
});
document.getElementById("logout").addEventListener("click", async () => {
	auth.signOut();
});

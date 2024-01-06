import {googleAuthProvider, githubAuthProvider, auth} from "./firebase-config.js";
import {signInWithPopup} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {login} from "./userNotAuth-observer.js";
document.getElementById("googleLogin").addEventListener("click", async () => {
	login((await signInWithPopup(auth, googleAuthProvider)).user);
});
document.getElementById("githubLogin").addEventListener("click", async () => {
	login((await signInWithPopup(auth, githubAuthProvider)).user);
});

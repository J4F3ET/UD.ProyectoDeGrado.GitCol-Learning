import {auth} from "./firebase.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
document.getElementById("logout").addEventListener("click", async () => {
	auth.signOut();
});
async function logout() {
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
	const response = logout();
    if ((await response).status === 200) {
        window.location.href = "/login";
    }else{
        alert("Logout failed");
    }
});
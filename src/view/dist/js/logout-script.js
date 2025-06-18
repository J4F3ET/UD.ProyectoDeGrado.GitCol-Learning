export async function logout() {
	const response = fetch("/logout", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const { auth } = await import("./firebase-config.js");
	auth.signOut();
	sessionStorage.removeItem("concept");
	return response;
}
export async function goToHome() {
	window.location.href = "/";
}

export async function logout(authParameter = null) {
	const auth = authParameter || (await import("./firebase-config.js")).auth;
	const uid = auth.currentUser?.uid;
	const { clearConceptsSessionStorage } = await import(
		"./utils/handler-nolog.js"
	);
	clearConceptsSessionStorage(uid);
	const response = fetch("/logout", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	auth.signOut();
	return response;
}
export async function goToHome() {
	window.location.href = "/";
}

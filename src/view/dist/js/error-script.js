setTimeout(async () => {
	const {goToHome} = await import("./userAuth-observer.js");
	goToHome();
}, 2500);

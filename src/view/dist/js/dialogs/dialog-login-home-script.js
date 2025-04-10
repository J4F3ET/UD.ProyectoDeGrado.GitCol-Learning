const dialog_login = document.querySelector("#dialog_login");
document
	.getElementById("btn_login")
	.addEventListener("click", async () => dialog_login.showModal());
document
	.getElementById("btn_close_login")
	.addEventListener("click", async () => dialog_login.close());

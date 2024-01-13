import {logout} from "./userAuth-observer.js";
document.getElementById("btnLogout").addEventListener("click", () => logout());
document
	.getElementById("selectLevelChallenge")
	.addEventListener("change", () => {
		const level = document.getElementById("selectLevelChallenge").value || 0;
		const url = `http://localhost:3000/challenges/${level}`;
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const selectChallenge = document.getElementById("selectChallenge");
				data.forEach((challenge) => {
					const option = document.createElement("option");
					option.value = challenge.id;
					option.textContent = challenge.name;
					selectChallenge.appendChild(option);
				});
			});
});
const dialogCreateRoom = document.getElementById("dialogCreateRoom");
document.getElementById("btnCreateRoom").addEventListener("click", () => {
	dialogCreateRoom.showModal();

})
document.getElementById("btnCancelCreateRoom").addEventListener("click", () => {
	dialogCreateRoom.close();
})
import {logout} from "./userAuth-observer.js";
document.getElementById("btnLogout").addEventListener("click", () => logout());
document.getElementById("selectLevelChallenge").addEventListener("change", () => 
	getChallenge().then((response) => document.getElementById("selectChallenge").disabled = response)
);
function inflateSelectChallenge(challenges) {
	const selectChallenge = document.getElementById("selectChallenge");
	selectChallenge.options.length = 0;
	for(const challenge in challenges){
		const option = document.createElement("option");
		option.value = challenge;
		option.textContent = challenges[challenge].name;
		option.classList.add("room_option");
		selectChallenge.appendChild(option);
	}
	return selectChallenge.options.length === 0;
}
async function getChallenge() {
	const level = document.getElementById("selectLevelChallenge").value || 0;
	const response = fetch(`http://localhost:3000/challenges?level=${level}`)
	return inflateSelectChallenge(await (await response).json());
}
const dialogCreateRoom = document.getElementById("dialogCreateRoom");
document.getElementById("btnCreateRoom").addEventListener("click", () => {
	getChallenge().then((response) => document.getElementById("selectChallenge").disabled = response)
	dialogCreateRoom.showModal();
})
document.getElementById("btnCancelCreateRoom").addEventListener("click", () => dialogCreateRoom.close())
function updateValidateRequirement(element,validation) {
	if(validation){
		element.classList.remove("invalidRequirements");
		element.classList.add("validRequirements");
	}else{
		element.classList.remove("validRequirements");
		element.classList.add("invalidRequirements");
	}
}
document.getElementById("inputRoomCode").addEventListener("input", () => {
	const validLetterAndNumber = /^[a-zA-Z0-9]+$/;
	const value = document.getElementById("inputRoomCode").value;
	updateValidateRequirement(document.getElementById("validLetterAndNumber"),validLetterAndNumber.test(value));
	updateValidateRequirement(document.getElementById("validMinCharacters"),value.length >= 4);
	updateValidateRequirement(document.getElementById("validMaxCharacters"),value.length <= 8 && value.length >= 4);
	const valid = document.getElementById("inputRoomCode").checkValidity();
	document.getElementById("btnSubmitCreateRoom").disabled = !valid;
})
function checkValidity() {
	const valid = document.getElementById("inputRoomCode").checkValidity();
	const description = document.getElementById("inputRoomDescription").checkValidity();
	return !(valid && description);
}
document.getElementById("btnSubmitCreateRoom").addEventListener("click", () => {
	if(checkValidity())return;
	const code = document.getElementById("inputRoomCode").value || "";
	const description = document.getElementById("inputRoomDescription").value;
	const challenge = document.getElementById("selectChallenge").value;
	const level = document.getElementById("selectLevelChallenge").value;
	const hidden = !document.getElementById("inputRoomHidden").checked;
	const room = {
		code,
		description,
		challenge,
		hidden,
		level
	}
	fetch("/rooms", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(room)
	}).then((response) => {
		if(response.ok){
			response.json().then((data) => {
				alert(data);
			});
			dialogCreateRoom.close();
		}
		else{
			alert("No se pudo crear la sala");
		}
	});
});

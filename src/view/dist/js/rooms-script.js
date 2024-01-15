import {logout} from "./userAuth-observer.js";
const dialogCreateRoom = document.getElementById("dialogCreateRoom");
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
	const response = fetch(`/challenges?level=${level}`)
	return inflateSelectChallenge(await (await response).json());
}
function updateValidateRequirement(element,validation) {
	if(validation){
		element.classList.remove("invalidRequirements");
		element.classList.add("validRequirements");
	}else{
		element.classList.remove("validRequirements");
		element.classList.add("invalidRequirements");
	}
}
function checkValidity() {
	const valid = document.getElementById("inputRoomCode").checkValidity();
	const description = document.getElementById("inputRoomDescription").checkValidity();
	return !(valid && description);
}
document.getElementById("btnLogout").addEventListener("click", () => logout());
document.getElementById("selectLevelChallenge").addEventListener("change", () => 
	getChallenge().then((response) => document.getElementById("selectChallenge").disabled = response)
);
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
		if(!response.ok)return;
		response.json().then((data) => {
			dialogCreateRoom.close();
			window.location.href = `/teamWorking?room=${data.room}`;
		})
	});
});
document.getElementById("inputSearchRoomCode").addEventListener("input", (e) => {
	e.target.value = e.target.value.toUpperCase();
	const validLetterAndNumber = /^[A-Z0-9]+$/;
	const value = document.getElementById("inputSearchRoomCode").value;
	updateValidateRequirement(document.getElementById("validLetterAndNumberSearch"),validLetterAndNumber.test(value));
	updateValidateRequirement(document.getElementById("validMinCharactersSearch"),value.length >= 4);
	updateValidateRequirement(document.getElementById("validMaxCharactersSearch"),value.length <= 8 && value.length >= 4);
	const valid = document.getElementById("inputSearchRoomCode").checkValidity();
	document.getElementById("btnLoginToRoom").disabled = !valid;
});
document.getElementById("inputRoomCode").addEventListener("input", (e) => {
	e.target.value = e.target.value.toUpperCase();
	const validLetterAndNumber = /^[A-Z0-9]+$/;
	const value =  e.target.value;
	updateValidateRequirement(document.getElementById("validLetterAndNumber"),validLetterAndNumber.test(value));
	updateValidateRequirement(document.getElementById("validMinCharacters"),value.length >= 4);
	updateValidateRequirement(document.getElementById("validMaxCharacters"),value.length <= 8 && value.length >= 4);
	const required = document.getElementById("validRoomCode");
	if(value.length > 3){
		fetch(`/rooms/code?code=${value}`).then((response) => {
			if(!response.ok)return;
			response.json().then((data) => {
				updateValidateRequirement(required,data.code);
				required.textContent = data.code ? "Room code available" : "The code is already in use";
			})
		});
	}else{
		updateValidateRequirement(required,false);
		required.textContent = "The code is already in use";
	}
	const valid = document.getElementById("inputRoomCode").checkValidity();
	document.getElementById("btnSubmitCreateRoom").disabled = !valid;
});
document.getElementById("btnCreateRoom").addEventListener("click", () => {
	getChallenge().then((response) => document.getElementById("selectChallenge").disabled = response)
	dialogCreateRoom.showModal();
});
document.getElementById("btnLoginToRoom").addEventListener("click", (e) => {
	e.preventDefault();
	const code = document.getElementById("inputSearchRoomCode").value;
	fetch(`/rooms/fit?code=${code}`).then((response) => {
		if(!response.ok)return;
		response.json().then((data) => {
			if(data.ok && data.response !== false){
				window.location.href = `/teamWorking?room=${data.response}`;
			}
		})
	});
});
document.getElementById("btnCancelCreateRoom").addEventListener("click", () => dialogCreateRoom.close());



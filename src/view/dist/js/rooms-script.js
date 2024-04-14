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
document.getElementById("inputSearchRoomCode").addEventListener("input", (e) => {
	e.target.value = e.target.value.toUpperCase();
	const validLetterAndNumber = /^[A-Z0-9]+$/;
	const value = document.getElementById("inputSearchRoomCode").value;
	updateValidateRequirement(document.getElementById("validLetterAndNumberSearch"),validLetterAndNumber.test(value));
	updateValidateRequirement(document.getElementById("validMinCharactersSearch"),value.length >= 4);
	updateValidateRequirement(document.getElementById("validMaxCharactersSearch"),value.length <= 8 && value.length >= 4);
	document.getElementById("btnLoginToRoom").disabled = e.target.value.length < 4 || e.target.value.length > 8 || !validLetterAndNumber.test(e.target.value);
});
function checkInputRoomCode(element,code){
	return element.value.length < 4 || element.value.length > 8 || !/^[A-Z0-9]+$/.test(element.value) || !code;
}
function validateInputRoomCode(element){
	const validLetterAndNumber = /^[A-Z0-9]+$/;
	const required = document.getElementById("validRoomCode");
	if(element.value.length > 3){
		fetch(`/rooms/code?code=${element.value}`).then((response) => {
			if(!response.ok)return;
			response.json().then((data) => {
				updateValidateRequirement(required,data.code);
				required.textContent = data.code ? "Room code available" : "The code is already in use";
				document.getElementById("btnSubmitCreateRoom").disabled = checkInputRoomCode(element,data.code);
			})
		});
	}else{
		required.textContent = "The code is already in use";
		updateValidateRequirement(required,false);
		document.getElementById("btnSubmitCreateRoom").disabled = true;
	}
	updateValidateRequirement(document.getElementById("validLetterAndNumber"),validLetterAndNumber.test(element.value));
	updateValidateRequirement(document.getElementById("validMinCharacters"),element.value.length >= 4);
	updateValidateRequirement(document.getElementById("validMaxCharacters"),element.value.length <= 8 && element.value.length >= 4);
}
document.getElementById("inputRoomCode").addEventListener("input", (e) => {
	e.target.value = e.target.value.toUpperCase();
	validateInputRoomCode(e.target);
});
document.getElementById("btnLogout").addEventListener("click", async () => {
	const response = logout()
	const data = (await response).json();
	if ((await response).status === 200)
		window.location.href = (await data).url||"/home";
});
document.getElementById("selectLevelChallenge").addEventListener("change", () => 
	getChallenge().then((response) => document.getElementById("selectChallenge").disabled = response)
);
document.getElementById("btnSubmitCreateRoom").addEventListener("click", (e) => {
	const code = document.getElementById("inputRoomCode").value;
	if(code.length < 4 || code.length > 8)return;
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
document.getElementById("btnCreateRoom").addEventListener("click", () => {
	getChallenge().then((response) => document.getElementById("selectChallenge").disabled = response)
	validateInputRoomCode(document.getElementById("inputRoomCode"));
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
			}else{
				Swal.fire({
					position: "center",
					icon: "error",
					title: "Room not found",
					showConfirmButton: false,
					timer: 1500
				});
			}
		})
	});
});
document.getElementById("btnCancelCreateRoom").addEventListener("click", () => dialogCreateRoom.close());



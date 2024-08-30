import {logout,goToHome} from "./userAuth-observer.js";
const dialogCreateRoom = document.getElementById("dialogCreateRoom");
const dialogSearchRoom = document.getElementById("dialogSearchRoom");
const RESPONSE_BAD_REQUEST = 400
const RESPONSE_UNAUTHORIZED = 401
const RESPONSE_UNKNOWN_USER = 403
const RESPONSE_NOT_FOUND = 404
const RESPONSE_INTERNAL_SERVER_ERROR = 500
const alert = (response) => Swal.fire({
	position: "center",
	icon: "error",
	title: response.statusText,
	showConfirmButton: false,
	timer: 1500
});
function loginToRoom(code){
	fetch(`/rooms/fit?code=${code}`).then((response) => {

		if(response.ok)
			response.json().then((data) => window.location.href = `/teamWorking?room=${data}`)
		else
			alert(response)
			
		if(response.status == RESPONSE_UNKNOWN_USER || response.status == RESPONSE_UNAUTHORIZED)
			goToHome();
	});
}
function getCardRoom(room) {
	const card = document.createElement("div");
	const cardHeader = document.createElement("div");
	const cardTitle = document.createElement("h2");
	const cardDescription = document.createElement("p");
	const cardBody = document.createElement("div");
	const cardInfo = document.createElement("div");
	const cardCode = document.createElement("p");
	const codeSpan = document.createElement("span");
	const cardLevel = document.createElement("p");
	const levelSpan = document.createElement("span");
	card.classList.add("card");
	card.classList.add("btn");
	cardHeader.classList.add("card__header");
	cardTitle.classList.add("card__title");
	cardTitle.textContent = "Room";
	cardDescription.classList.add("card__description");
	cardDescription.textContent = room.description;
	cardBody.classList.add("card__body");
	cardInfo.classList.add("card__info");
	cardCode.classList.add("card__code");
	cardCode.textContent = "Code: ";
	codeSpan.textContent = room.code;
	cardCode.appendChild(codeSpan);
	cardLevel.classList.add("card__members");
	cardLevel.textContent = "Members: ";
	levelSpan.textContent = room.members;
	cardLevel.appendChild(levelSpan);
	cardInfo.appendChild(cardCode);
	cardInfo.appendChild(cardLevel);
	cardBody.appendChild(cardInfo);
	cardHeader.appendChild(cardTitle);
	cardHeader.appendChild(cardDescription);
	card.appendChild(cardHeader);
	card.appendChild(cardBody);
	card.addEventListener("click", () => loginToRoom(room.code));
	return card;
}
async function getRoomsPublic(){
	const response = await fetch("/rooms/all/public");
	if(response.status == RESPONSE_NOT_FOUND){
		alert(response)
		return null
	}

	if(!response.ok)
		await goToHome();

	return response.json();
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
function checkInputRoomCode(element,code){
	return element.value.length < 4 || element.value.length > 8 || !/^[A-Z0-9]+$/.test(element.value) || !code;
}
function validateInputRoomCode(element){
	const validLetterAndNumber = /^[A-Z0-9]+$/;
	const required = document.getElementById("validRoomCode");
	const callback =  (data)=>{
		console.log(checkInputRoomCode(element,element.value))
		updateValidateRequirement(required,data);
		required.textContent = data ? "Room code available" : "The code is already in use";
		document.getElementById("btnSubmitCreateRoom").disabled = checkInputRoomCode(element,element.value);
	}
	if(element.value.length > 3){
		fetch(`/rooms/code?code=${element.value}`).then((response) => {
			if(response.status == RESPONSE_NOT_FOUND || response.ok)
				callback(!response.ok)

			else if(!response.ok)
				goToHome();
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

document.getElementById("inputSearchRoomCode").addEventListener("input", (e) => {
	e.target.value = e.target.value.toUpperCase();
	const validLetterAndNumber = /^[A-Z0-9]+$/;
	const value = document.getElementById("inputSearchRoomCode").value;
	updateValidateRequirement(document.getElementById("validLetterAndNumberSearch"),validLetterAndNumber.test(value));
	updateValidateRequirement(document.getElementById("validMinCharactersSearch"),value.length >= 4);
	updateValidateRequirement(document.getElementById("validMaxCharactersSearch"),value.length <= 8 && value.length >= 4);
	document.getElementById("btnLoginToRoom").disabled = e.target.value.length < 4 || e.target.value.length > 8 || !validLetterAndNumber.test(e.target.value);
});
document.getElementById("inputRoomCode").addEventListener("input", (e) => {
	e.target.value = e.target.value.toUpperCase();
	validateInputRoomCode(e.target);
});
document.getElementById("btnLogout").addEventListener("click", async () => {
	logout()
	goToHome()
});
document.getElementById("btnSubmitCreateRoom").addEventListener("click", (e) => {
	const code = document.getElementById("inputRoomCode").value;
	if(code.length < 4 || code.length > 8)return;
	const description = document.getElementById("inputRoomDescription").value;
	const hidden = !document.getElementById("inputRoomHidden").checked;
	const room = {
		code,
		description,
		hidden,	
	}
	fetch("/rooms", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(room)
	}).then((response) => {

		if(!response.ok && response.status != RESPONSE_BAD_REQUEST)
			goToHome();

		if(response.status == RESPONSE_BAD_REQUEST)
			return alert(response)

		response.json().then((idRoom) => {
			dialogCreateRoom.close();
			window.location.href = `/teamWorking?room=${idRoom}`;
		})
	});
});
document.getElementById("btnCreateRoom").addEventListener("click", () => {
	validateInputRoomCode(document.getElementById("inputRoomCode"));
	dialogCreateRoom.showModal();
});
document.getElementById("btnLoginToRoom").addEventListener("click", (e) => {
	e.preventDefault();
	const code = document.getElementById("inputSearchRoomCode").value;
	loginToRoom(code);
});

document.getElementById("btnCancelCreateRoom").addEventListener("click", () => dialogCreateRoom.close());
document.getElementById("btnFindRoom").addEventListener("click", async() => {
	const rooms = await getRoomsPublic();
	if(!rooms)
		return
	const container = document.getElementById("container_rooms_public");
	container.innerHTML = "";
	rooms.forEach(room => container.appendChild(getCardRoom(room)));
	dialogSearchRoom.showModal();
});
document.getElementById("btnCancelSearchRoom").addEventListener("click", () => dialogSearchRoom.close());

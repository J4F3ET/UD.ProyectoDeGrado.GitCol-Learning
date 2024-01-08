import { logout } from "./userAuth-observer.js";
document.getElementById("btnLogout").addEventListener("click", () => logout());
document.getElementById("selectLevelChallenge").addEventListener("change", () => {
    const level = document.getElementById("selectLevelChallenge").value;
    const url = `http://localhost:3000/challenges/${level}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const challenges = data;
            const tbody = document.getElementById("tbodyChallenges");
            tbody.innerHTML = "";
            challenges.forEach((challenge) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${challenge.id}</td>
                    <td>${challenge.name}</td>
                    <td>${challenge.level}</td>
                    <td>${challenge.description}</td>
                    <td>${challenge.score}</td>
                    <td>${challenge.time}</td>
                    <td>${challenge.hints}</td>
                    <td>${chal
});
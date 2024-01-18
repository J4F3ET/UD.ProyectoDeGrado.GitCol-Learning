document.getElementById("team").addEventListener("click",()=>{
    window.location.href = "login";
});
const dialogSelectLevel = document.getElementById("dialogSelectLevel");
const dialogSelectChallenge = document.getElementById("dialogSelectChallenge");
document.getElementById("alone").addEventListener("click",()=>{
    dialogSelectLevel.showModal();
});
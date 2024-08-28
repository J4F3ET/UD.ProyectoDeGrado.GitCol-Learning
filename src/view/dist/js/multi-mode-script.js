const containerRepositoryLocal = document.getElementById("svgContainer");
const containerRepositoryCloud = document.getElementById("svgContainerCloud");
const toggleRepository = async () => {
    const btnToggle = document.getElementById("btnToggleRepository");
    const icono = btnToggle.querySelector("i");
    const text = btnToggle.querySelector("p")
    const currentShowRepository = btnToggle.dataset.repository;
    if(currentShowRepository === "Local"){
        showElement(containerRepositoryLocal,containerRepositoryCloud);
        btnToggle.dataset.repository = "Cloud";
        changeClassList(icono,"cloud","folder");
        text.innerText = "Go to local"
    }else if(currentShowRepository === "Cloud"){
        showElement(containerRepositoryCloud,containerRepositoryLocal);
        btnToggle.dataset.repository = "Local";
        changeClassList(icono,"folder","cloud");
        text.innerText  = "Go to remote"
    }
}
async function showElement(elementHide,elementShow){
    changeClassList(elementShow,"hidden-repository","show-repository");
    changeClassList(elementHide,"show-repository","hidden-repository");
}
async function changeClassList(element,remove,add){
    element.classList.remove(remove);
    element.classList.add(add);
}
document.getElementById("btnLeaveToRoom").addEventListener("click",() => leaveToRoom());
async function leaveToRoom(){
    const response = await fetch(window.location.href,
        {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
    })
    if(!(response).ok)return;
    const data = await response.json();
    if(!data.success)return;
    window.location.href = "/rooms";
};
document.getElementById("btnToggleRepository").addEventListener("click",() => toggleRepository());
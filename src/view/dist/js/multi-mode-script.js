const containerRepositoryLocal = document.getElementById("svgContainer");
const containerRepositoryCloud = document.getElementById("svgContainerCloud");
const toggleRepository = async () => {
    const btnToggle = document.getElementById("btnToggleRepository");
    const icono = btnToggle.querySelector("i");
    const currentShowRepository = btnToggle.dataset.repository;
    if(currentShowRepository === "Local"){
        showElement(containerRepositoryLocal,containerRepositoryCloud);
        changeClassList(icono,"cloud","folder");
        btnToggle.dataset.repository = "Cloud";
    }else if(currentShowRepository === "Cloud"){
        showElement(containerRepositoryCloud,containerRepositoryLocal);
        changeClassList(icono,"folder","cloud");
        btnToggle.dataset.repository = "Local";
    }
}
async function showElement(elementHide,elementShow){
    changeClassList(elementShow,"hidden-repository","show-repository");
    changeClassList(elementHide,"show-repository","hidden-repository");
}
async function changeClassList(element,remove,add){
    try {
        element.classList.remove(remove);
        element.classList.add(add);
    } catch (error) {
        console.log("Error al cambiar la clase del elemento "+remove+" por "+add+" en el elemento");
        console.log(element);
    }
    
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
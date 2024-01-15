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
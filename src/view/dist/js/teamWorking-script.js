document.getElementById("btnLeaveToRoom").addEventListener("click",() => leaveToRoom());
function leaveToRoom(){
    fetch(window.location.href,
        {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
    })
};
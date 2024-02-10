const socket = io();
document.getElementById("btnSendMessage").addEventListener("click", () => {
    console.log("hola");
    const message = 'Hello Word';
    socket.emit("chat", message);
    
});
console.log(window.location.href.split("=")[1]);
socket.on("message", (message) => {
    console.log(message);
});

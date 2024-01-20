const socket = io();
document.getElementById("btnSendMessage").addEventListener("click", () => {
    console.log("hola");
    const message = 'Hello Word';
    socket.emit("connection", message);
});

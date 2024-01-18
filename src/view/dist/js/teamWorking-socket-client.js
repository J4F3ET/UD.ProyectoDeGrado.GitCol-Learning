const socket = io();
document.getElementById("btnSendMessage").addEventListener("click", () => {
    const message = 'Hello Word';
    socket.emit("chat message", message);
});

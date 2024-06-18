import { SocketHandler } from "./comandManager/SocketHandler.js";
const socketManager = new SocketHandler(REF_STORAGE_REPOSITORY_CLOUD);

socketManager.socket.on('message', (message) => {
    console.log(message);
});
socketManager.socket.emit('message', 'Hello everyone!');
document.getElementById('btnLeaveToRoom').addEventListener('click', () => {
    socketManager.socket.emit('disconnect')
});
document.getElementById('btnToggleRepository').addEventListener('click', () => {
    socketManager.socket.emit('updateRepository',JSON.stringify(localStorage.getItem('log')));
});

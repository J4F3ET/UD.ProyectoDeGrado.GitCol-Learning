import { SocketHandler } from "./comandManager/SocketHandler.js";
const socketManager = new SocketHandler(REF_STORAGE_REPOSITORY_CLOUD);

document.getElementById('btnLeaveToRoom').addEventListener('click', () => {
    socketManager.disconnect();
});
document.getElementById('btnToggleRepository').addEventListener('click', () => {
    socketManager.sendUpdateRepository(localStorage.getItem(REF_STORAGE_REPOSITORY));
});

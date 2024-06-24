import { SocketHandler } from "./comandManager/SocketHandler.js";
const socketManager = new SocketHandler(REF_STORAGE_REPOSITORY_CLOUD);

document.getElementById('btnLeaveToRoom').addEventListener('click', () => {
    socketManager.disconnect();
});
document.getElementById('btnPush').addEventListener('click', () => {
    socketManager.sendUpdateRepository(JSON.parse(localStorage.getItem(REF_STORAGE_REPOSITORY)));
});

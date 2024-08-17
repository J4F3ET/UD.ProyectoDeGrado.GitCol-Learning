import { SocketHandler } from "./comandManager/SocketHandler.js";
import { observerCloud } from "./mode-script.js";
const socketHandler = new SocketHandler(REF_STORAGE_REPOSITORY_CLOUD,observerCloud)
document.getElementById('btnLeaveToRoom').addEventListener('click', () => {
    socketHandler.disconnect();
});


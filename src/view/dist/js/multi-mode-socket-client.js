import { SocketHandler } from "./comandManager/SocketHandler.js";

document.getElementById('btnLeaveToRoom').addEventListener('click', () => {
    new SocketHandler(REF_STORAGE_REPOSITORY_CLOUD).disconnect();
});


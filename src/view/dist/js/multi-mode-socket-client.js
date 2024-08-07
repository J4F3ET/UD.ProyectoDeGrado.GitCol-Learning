import { SocketHandler } from "./comandManager/SocketHandler.js";
import { observerCloud} from "./mode-script.js";
const socketManager = new SocketHandler(REF_STORAGE_REPOSITORY_CLOUD,observerCloud);

document.getElementById('btnLeaveToRoom').addEventListener('click', () => {
    socketManager.disconnect();
});
document.getElementById('btnPush').addEventListener('click', () => {
    socketManager.sendUpdateRepository(JSON.parse(sessionStorage.getItem(REF_STORAGE_REPOSITORY)));
});

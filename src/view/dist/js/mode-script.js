import { DataViewer } from "./dataViewer/DataViewer.js";
import { factoryCommandManager } from "./comandManager/comandManager-factory.js";
import { Observer } from "./dataViewer/Observer.js";
const listCommands = ["init","commit","checkout","branch","log","merge"];
if(REF_STORAGE_REPOSITORY_CLOUD){
    listCommands.push("push","pull","clone","fetch");
}
const messageCallback = (listCommand)=>{
    let messageString = `
        <h5 class="help">Commands shell</h5>
        <p class="help">>clear</p>
        <p class="help">>help</p>
        <h5 class="help">Commands git</h5>`
        listCommand.forEach(commandString => {
            messageString += `<p class="help">>git ${commandString}</p>`
        });
    return messageString += `
        <p class="help">
            More information using 'git &lt;comand&gt; [-h|--help]'
        </p>`
}
const DEFAULT_MESSAGE = {
    tag:"info",
    message:messageCallback(listCommands)
};

const aloneModeCommandManager = factoryCommandManager(
    listCommands,
    [
        REF_STORAGE_REPOSITORY,
        REF_STORAGE_LOG,
        REF_STORAGE_REPOSITORY_CLOUD
    ]
);
let listComands = JSON.parse(sessionStorage.getItem(REF_STORAGE_LOG))?.filter(log => log.tag === "comand")?.map(log => log.message)|| [];
const dataViewerLocal = new DataViewer(document.getElementById("svgContainer"));
const observer = new Observer()
let accountComands = listComands.length;
// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => init());
document.getElementById("comandInput").addEventListener("keyup",(e) => {
    if(e.key === "ArrowUp"){
        accountComands= accountComands === 0 ? listComands.length-1 : accountComands-1;
        e.target.value = listComands[accountComands] || "";
        return;
    }
    if(e.key === "ArrowDown"){
        accountComands= accountComands >= listComands.length-1 ? 0 : accountComands+1;
        e.target.value = listComands[accountComands] || "";
        return
    }
    if(e.key === "Enter"){
        executeCommand(e.target.value);
        e.target.value = "";
        listComands = JSON.parse(sessionStorage.getItem(REF_STORAGE_LOG)).filter(log => log.tag === "comand").map(log => log.message);
        accountComands = listComands.length;
        return;
    }
});
// FUNCTIONS
const init = () => {
    dataViewerLocal.currentData =  null;
    dataViewerLocal.logComands = null;
    if(sessionStorage.getItem(REF_STORAGE_LOG) === null)
        sessionStorage.setItem(REF_STORAGE_LOG,JSON.stringify([DEFAULT_MESSAGE]));
    observer.notify(sessionStorage.getItem(REF_STORAGE_LOG))
    observer.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY))
}
/**
 * @name executeCommand
 * @description Execute the comand and show the result
 * @param {String} comand 
 */
const executeCommand = (comand) => {
    comand !== "" ?aloneModeCommandManager.createMessage('comand',comand) : null;
    try {
        aloneModeCommandManager.executeCommand(comand.trim());
        observer.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY));
        setTimeout(()=>{
            observer.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY))
        },1500)
    } catch (error) {
        aloneModeCommandManager.createMessage('error',error.message);
    }finally{
        observer.notify(sessionStorage.getItem(REF_STORAGE_LOG))
        accountComands = 1;
    }
};
// OBSERVER
observer.subscribe(dataViewerLocal)
// ZONE VIEW (EFECS AND OBSERVERS)
const containerLogs = document.getElementById("logContainer");
const containerSvg = document.getElementById("svgContainer");
const observerScroll = new MutationObserver(()=>containerLogs.scrollTop = containerLogs.scrollHeight)
const observerScrollSvgHorizontal = new MutationObserver(()=>containerSvg.scrollLeft = containerSvg.scrollWidth)
observerScroll.observe(containerLogs,{childList:true})
observerScrollSvgHorizontal.observe(containerSvg, { childList: true, subtree: true });

// MODULE MULTI-MODE
const observerCloud = new Observer();
const containerSvgCloud = document.getElementById("svgContainerCloud");
if(containerSvgCloud){
    const dataViewerCloud = new DataViewer(document.getElementById("svgContainerCloud"));
    observerCloud.subscribe(dataViewerCloud);
    observerCloud.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY_CLOUD));
    const observerScrollSvgHorizontalCloud = new MutationObserver(()=>containerSvgCloud.scrollLeft = containerSvgCloud.scrollWidth)
    observerScrollSvgHorizontalCloud.observe(containerSvgCloud, { childList: true, subtree: true });
}
export {observerCloud}
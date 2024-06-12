import { DataViewer } from "./dataViewer/DataViewer.js";
import { factoryCommandManager } from "./comandManager/working-alone-comandManager.js";
import { Observer } from "./dataViewer/Observer.js";
console.log(REF_STORAGE_LOG);
console.log(REF_STORAGE_REPOSITORY);
const aloneModeCommandManager = factoryCommandManager(
    ["init","commit","checkout","branch","log","merge"],
    [REF_STORAGE_REPOSITORY,REF_STORAGE_LOG]
);
let listComands = JSON.parse(localStorage.getItem(REF_STORAGE_LOG))?.filter(log => log.tag === "comand")?.map(log => log.message)|| [];
const dataViewer = new DataViewer(document.getElementById("svgContainer"));
const observer = new Observer()
let accountComands = listComands.length;
// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    dataViewer.currentData =  null;
    dataViewer.logComands = null;
    observer.notify(localStorage.getItem(REF_STORAGE_LOG))
    observer.notify(localStorage.getItem(REF_STORAGE_REPOSITORY))
});
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
        listComands = JSON.parse(localStorage.getItem(REF_STORAGE_LOG)).filter(log => log.tag === "comand").map(log => log.message);
        accountComands = listComands.length;
        return;
    }
});
// FUNCTIONS
/**
 * @name executeCommand
 * @description Execute the comand and show the result
 * @param {String} comand 
 */
const executeCommand = (comand) => {
    comand !== "" ?aloneModeCommandManager.createMessage('comand',comand) : null;
    try {
        aloneModeCommandManager.executeCommand(comand.trim());
        observer.notify(localStorage.getItem(REF_STORAGE_REPOSITORY));
        setTimeout(()=>{
            observer.notify(localStorage.getItem(REF_STORAGE_REPOSITORY))
        },1500)
    } catch (error) {
        aloneModeCommandManager.createMessage('error',error.message);
    }finally{
        observer.notify(localStorage.getItem(REF_STORAGE_LOG))
        accountComands = 1;
    }
};
// OBSERVER
observer.subscribe(dataViewer)
// ZONE VIEW (EFECS AND OBSERVERS)
const containerLogs = document.getElementById("logContainer");
const containerSvg = document.getElementById("svgContainer");
const observerScroll = new MutationObserver(()=>containerLogs.scrollTop = containerLogs.scrollHeight)
const observerScrollSvgHorizontal = new MutationObserver(()=>containerSvg.scrollLeft = containerSvg.scrollWidth)
observerScroll.observe(containerLogs,{childList:true})
observerScrollSvgHorizontal.observe(containerSvg, { childList: true, subtree: true });

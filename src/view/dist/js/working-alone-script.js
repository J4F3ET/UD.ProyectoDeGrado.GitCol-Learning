import { DataViewer } from "./dataViewer/DataViewer.js";
import { workingAloneComandManager as comandManager} from "./comandManager/working-alone-comandManager.js";
import { Observer } from "./dataViewer/Observer.js";
const REF_STORAGE_REPOSITORY = "local";
const REF_STORAGE_LOG = "log";
let listComands = JSON.parse(localStorage.getItem(REF_STORAGE_LOG))?.filter(log => log.tag === "comand")?.map(log => log.message)|| [];
const dataViewer = new DataViewer(document.getElementById("svgContainer"));
const observer = new Observer()
let accountComands = listComands.length;
// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    dataViewer.currentData =  null;
    dataViewer.logComands = null;
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
    comand !== "" ? comandManager.createMessage('comand',comand) : null;
    try {
        const [_,gitComand, ...comandConfig] = comand.split(' ');
        comandManager.executeCommand(comand,gitComand,comandConfig);
    } catch (error) {
        comandManager.createMessage('error',error.message);
    }finally{
        accountComands = 1;
    }
};
// OBSERVER
observer.subscribe("log",dataViewer)
observer.subscribe("SVG",dataViewer)
setInterval(()=>{
    observer.notify("SVG",localStorage.getItem(REF_STORAGE_REPOSITORY))
    observer.notify("log",localStorage.getItem(REF_STORAGE_LOG))
},500);
// ZONE VIEW (EFECS AND OBSERVERS)
const containerLogs = document.getElementById("logContainer");
const containerSvg = document.getElementById("svgContainer");
const observerScroll = new MutationObserver(()=>containerLogs.scrollTop = containerLogs.scrollHeight)
const observerScrollSvgHorizontal = new MutationObserver(()=>containerSvg.scrollLeft = containerSvg.scrollWidth)
observerScroll.observe(containerLogs,{childList:true})
observerScrollSvgHorizontal.observe(containerSvg, { childList: true, subtree: true });

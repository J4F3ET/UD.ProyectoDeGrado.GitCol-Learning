import { DataViewer } from "./dataViewer/DataViewer.js";
import { workingAloneComandManager as comandManager} from "./comandManager/working-alone-comandManager.js";
import { Observer } from "./dataViewer/Observer.js";
const REF_STORAGE_REPOSITORY = "local";
const REF_STORAGE_LOG = "log";
const dataViewer = new DataViewer(document.getElementById("svgContainer"));
const observer = new Observer()
var accountComands = 1;
// EVENT LISTENERS
document.getElementById("comandInput").addEventListener("keyup",(e) => { 
    if(e.key === "ArrowUp"){
        const dataLog = JSON.parse(localStorage.getItem(REF_STORAGE_LOG))
        const comands = dataLog.reduce((uniqueComands, log) => {
            if(log.tag === "comand" && log.message !== '' && !uniqueComands.includes(log.message))
                uniqueComands.push(log.message);
            return uniqueComands;
        },[]);
        e.target.value = comands[comands.length-accountComands] || "";
        accountComands = accountComands === comands.length ? 1 : accountComands+1;
        return;
    }
    if(e.key === "Enter"){
        executeCommand(e.target.value);
        e.target.value = "";
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
    comand??comandManager.createMessage('comand',comand);
    try {
        const verify = verifyComand(comand);
        if(verify instanceof Error)
            throw verify;
        const [_,gitComand, ...comandConfig] = comand.split(' ');
        comandManager.executeCommand(gitComand,comandConfig);
    } catch (error) {
        comandManager.createMessage('error',error.message);
    }finally{
        accountComands = 1;
    }
};
/**
 * @name verifyComand
 * @description Verify if the comand is valid syntax
 * @param {String} comand 
 * @returns {Error|true}
 */
function verifyComand(comand="") {
    if(comand === "")
        return new Error('The command is empty');
    const refex = /^(git) [a-z]* *(?: .*)?$/
    if(!refex.test(comand))
        return new Error('The command is not valid');
    return true;
}
// OBSERVER
observer.subscribe("log",dataViewer)
observer.subscribe("SVG",dataViewer)
setInterval(() => {
    observer.notify("SVG",localStorage.getItem(REF_STORAGE_REPOSITORY))
    observer.notify("log",localStorage.getItem(REF_STORAGE_LOG))
}, 1000);
window.addEventListener('load', () => {
    dataViewer.currentData =  null;
    dataViewer.logComands = null;
})
// ZONE VIEW (EFECS AND OBSERVERS)
const containerLogs = document.getElementById("logContainer");
const containerSvg = document.getElementById("svgContainer");
const observerScroll = new MutationObserver(()=>containerLogs.scrollTop = containerLogs.scrollHeight)
const observerScrollSvgHorizontal = new MutationObserver(()=>containerSvg.scrollLeft = containerSvg.scrollWidth)
observerScroll.observe(containerLogs,{childList:true})
observerScrollSvgHorizontal.observe(containerSvg, { childList: true, subtree: true });

import { DataViewer } from "./dataViewer/DataViewer.js";
import { workingAloneComandManager as comandManager} from "./comandManager/working-alone-comandManager.js";
import { Observer } from "./dataViewer/Observer.js";
const dataViewer = new DataViewer(document.getElementById("svgContainer"));
const observer = new Observer()
document.getElementById("comandInput").addEventListener("change",(e) => {
    comandManager.createMessage('comand',e.target.value);
    try {
        const comand = e.target.value;
        const verify = verifyComand(comand);
        if(verify instanceof Error)
            throw verify;
        const [_,gitComand, ...comandConfig] = comand.split(' ');
        comandManager.executeCommand(gitComand,comandConfig);
    } catch (error) {
        comandManager.createMessage('error',error.message);
    }finally{
        e.target.value = "";
    }
});
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
observer.subscribe("log",dataViewer)
observer.subscribe("SVG",dataViewer)
setInterval(() => {
    observer.notify("SVG",localStorage.getItem('repository'))
    observer.notify("log",localStorage.getItem('log'))
}, 1000);
window.addEventListener('load', () => {
    dataViewer.currentData =  null;
    dataViewer.logComands = null;
})

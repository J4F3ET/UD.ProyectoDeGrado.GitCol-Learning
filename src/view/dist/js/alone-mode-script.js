import { driveUsageMode } from "./drivejs-mode-script.js";

document.getElementById("btnExit").addEventListener("click",() => {
    window.location.href = "/";
});
document.getElementById("btnTutorial").addEventListener("click",()=>{
    driveUsageMode({
      element: '#svg',
      popover: {
        title: 'Command visualization',
        description: 'In this section you will see a graphical representation of the commands you have executed.',
        side: "left",
        align: 'start'
      }
    }).drive()
})

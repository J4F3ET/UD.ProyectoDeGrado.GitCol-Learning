import { DataViewer } from "./dataViewer/DataViewer.js";
let contador = 1;
const dataViewer = new DataViewer();
console.log(dataViewer);
document.getElementById("svgContainer").appendChild(dataViewer.svg); 
document.getElementById("comandInput").addEventListener("change",(e) => {
    if(dataViewer.svg.getElementById("emptyContainer")!==null){
        dataViewer.initRepository();
    }
    const ultimoCommit = dataViewer.lastCommit();
    const newLine = dataViewer.createLine(ultimoCommit);
    const newCircle = dataViewer.createCommit(ultimoCommit);
    document.getElementById("gContainerPointer").appendChild(newLine);
    document.getElementById("gContainerCommit").appendChild(newCircle);
    e.target.value = "";	
    document.getElementById("contadorp").innerHTML = contador++;
    dataViewer.resizeSVG(newCircle);
});

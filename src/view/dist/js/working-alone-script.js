document.getElementById("comandInput").addEventListener("change",(e) => {
    const ultimoCommit = ultimoCommun();
    const newLine = generatorLine(ultimoCommit);
    const newCircle = generatorCircle(ultimoCommit);
    document.getElementById("gContainerPointer").appendChild(newLine);
    document.getElementById("gContainerCommit").appendChild(newCircle);
    setTimeout(() => {
        newLine.classList.add("branch");
        newCircle.setAttribute("r","20");
        newCircle.classList.add("checked-out");
        newLine.setAttribute("x2", parseInt(ultimoCommit.getAttribute("cx"))+25);
    },2);
    e.target.value = "";	
    document.getElementById("contadorp").innerHTML = contador++;
    resizeSVG(newCircle);
});

const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
svg.setAttribute("id", "svg");
svg.setAttribute("width", window.innerWidth * 0.75);
svg.setAttribute("height", window.innerHeight * 0.85);
svg.setAttribute("fill", "none");
svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
svg.innerHTML = `
<g id="gContainerPointer">
<line class="line" x1="24" y1="334" x2="-8.8" y2="334" stroke="black" marker-end="url(#triangle)"/>
</g>
<g id="gContainerCommit">
<circle class="commit" cx="50" cy="334" r="20" id="commit1"/>
</g>`;
document.getElementById("svgContainer").appendChild(svg);
function ultimoCommun() {
    const ultimo = document.querySelectorAll("circle");
    return ultimo[ultimo.length - 1];
}
function generarCodigo() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 7; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indice);
    }
    return codigo;
}
function generatorCircle(svgElement) {
    const newCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    newCircle.setAttribute("cx", parseInt(svgElement.getAttribute("cx")) + 50);
    newCircle.setAttribute("cy", parseInt(svgElement.getAttribute("cy")));
    newCircle.setAttribute("r", "20");
    newCircle.classList.add("commit");
    newCircle.id = generarCodigo();
    return newCircle;
}
function generatorLine(svgElement) {
    const newLine = document.createElementNS("http://www.w3.org/2000/svg","line");
    newLine.setAttribute("x1", parseInt(svgElement.getAttribute("cx"))+48);
    newLine.setAttribute("y1", parseInt(svgElement.getAttribute("cy")));
    newLine.setAttribute("x2", parseInt(svgElement.getAttribute("cx"))+7);
    newLine.setAttribute("y2", parseInt(svgElement.getAttribute("cy")));
    newLine.setAttribute("stroke", "black");
    newLine.setAttribute("marker-end", "url(#triangle)");
    newLine.classList.add("line");
    return newLine;
}
function resizeSVG(svgElement) {
    const oldWidth = parseInt(svg.getAttribute("width"));
    svg.setAttribute("width", oldWidth + 90);
    svg.style.width = oldWidth + 90 + "px";
    
}
document.getElementById("comandInput").addEventListener("change",() => {
    const ultimoCommit = ultimoCommun();
    const newLine = generatorLine(ultimoCommit);
    const newCircle = generatorCircle(ultimoCommit);
    resizeSVG(newCircle);
    document.getElementById("gContainerPointer").appendChild(newLine);
    document.getElementById("gContainerCommit").appendChild(newCircle);
    
});

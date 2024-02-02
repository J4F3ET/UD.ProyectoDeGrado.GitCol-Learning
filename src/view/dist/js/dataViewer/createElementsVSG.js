/**
 * @name createElementsVSG.js
 * @description Crea el SVG y los containers para los commits, lineas y otros elementos del SVG 
 * @returns {SVGSVGElement} Elemento de tipo SVG con los containers para los commits, lineas y otros elementos del SVG
 */
function createVSG(){
    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("id", "svg");
    svg.setAttribute("width", window.innerWidth * 0.75);
    svg.setAttribute("height", window.innerHeight * 0.85);
    svg.setAttribute("fill", "none");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.innerHTML = `
    <g id="gContainerPointer">
    <line class="line" x1="24" y1="334" x2="-10.8" y2="334" marker-end="url(#triangle)"/>
    </g>
    <g id="gContainerCommit">
    <circle class="commit checked-out" cx="50" cy="334" r="20" id="commit1"/>
    </g>`;
    return svg;
};
/**
 * @name createCommit
 * @description Crea un elemento svg de tipo circulo con las propiedades de un commit, se le asigna un id unico y se retorna con un radius de 2
 * @param {SVGCircleElement} svgElement Debe ser un elemento de tipo circulo parent de los commits, el commit previo al que se va a crear
 * @returns {SVGCircleElement} Elemento de tipo circulo con las propiedades de un commit
 */
function createCommit(svgElement){
    const newCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    newCircle.setAttribute("cx", parseInt(svgElement.getAttribute("cx")) + 70);
    newCircle.setAttribute("cy", parseInt(svgElement.getAttribute("cy")));
    newCircle.setAttribute("r", "2");
    newCircle.classList.add("commit");
    newCircle.id = generarCodigo();
    return newCircle;
}
/**
 * @name createLine
 * @description Crea un elemento svg de tipo linea con las propiedades de una linea, se le asigna un id unico y se retorna
 * @param {SVGCircleElement} svgElement Debe ser un elemento de tipo circulo parent de los commits, el commit previo al que se va a crear
 * @returns {SVGLineElement} Elemento de tipo linea con las propiedades de una linea
 */
function createLine(svgElement){
    const newLine = document.createElementNS("http://www.w3.org/2000/svg","line");
    //Para que la linea quede apuntando a la derecha se le suma 68 a x1 y a x2 se le suma 25, pero para la animacion esos valores se ponen despues agregar al contenedor
    newLine.setAttribute("x1", parseInt(svgElement.getAttribute("cx"))+68);// x1 es el punto de inicio de la linea en x
    newLine.setAttribute("y1", parseInt(svgElement.getAttribute("cy")));// y1 es el punto de inicio de la linea en y
    newLine.setAttribute("x2", parseInt(svgElement.getAttribute("cx"))+68);// x2 es el punto final de la linea en x
    newLine.setAttribute("y2", parseInt(svgElement.getAttribute("cy")));// y2 es el punto final de la linea en y
    newLine.setAttribute("marker-end", "url(#triangle)");
    newLine.classList.add("line");
    return newLine;
}

/**
 * @name lastCommit
 * @description Retorna el ultimo commit que se creo
 * @returns {SVGCircleElement} Elemento de tipo circulo con las propiedades de un commit
 */
function lastCommit() {
    const ultimo = document.querySelectorAll("circle");
    return ultimo[ultimo.length - 1];
}
/**
 * @name createCod
 * @description Crea un codigo de 7 caracteres aleatorios
 * @returns {string} Codigo de 7 caracteres aleatorios
 */
function createCod() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 7; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres.charAt(indice);
    }
    return codigo;
}
/**
 * @name resizeSVG
 * @description Aumenta el ancho del SVG para que quepan mas commits
 * @param {SVGSVGElement} svgElement Elemento de tipo SVG
 */
function resizeSVG(svgElement){
    const oldWidth = parseInt(svg.getAttribute("width"));
    // Con esto renderiza mas de 100 commits
    svg.setAttribute("width", oldWidth + 70);
    svg.style.width = oldWidth + 70 + "px";
}
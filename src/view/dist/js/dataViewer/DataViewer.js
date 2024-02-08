export class DataViewer{
    constructor(){
        this._logComands = []
        this._currentData = [];
        this._svg = this.createVSG();
    }
    get logComands(){
        return this._logComands;
    }
    set logComands(value){
        this._logComands = value;
    }
    get currentData(){
        return this._currentData;
    }
    set currentData(value){
        this._currentData = value;
    }
    get svg(){
        return this._svg;
    }
    /**
     * @name createVSG
     * @description Crea el SVG y los containers para los commits, lineas y otros elementos del SVG 
     * @returns {SVGSVGElement} Elemento de tipo SVG con los containers para los commits, lineas y otros elementos del SVG
     */
    createVSG(){
        const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        const widthSvg = window.innerWidth * 0.75;
        const heightSvg = window.innerHeight * 0.85;
        svg.setAttribute("id", "svg");
        svg.setAttribute("width", widthSvg);
        svg.setAttribute("height", heightSvg);
        svg.setAttribute("fill", "none");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.innerHTML = `
        <g id="emptyContainer">
            <text class="emptyTitle" x="50" y="${heightSvg/3}">
                Empy repository
            </text>
            <text class="empyText" x="50" y="${heightSvg/2.5}" >
                Use comand "git init" to start
            </text>
            <text class="empyText" x="50" y="${heightSvg/2.2}" >
                a new repository
            </text>
        </g>
        `
        return svg;
    };
    /**
     * @name createCommit
     * @description Crea un elemento svg de tipo circulo con las propiedades de un commit, se le asigna un id unico y se retorna con un radius de 2
     * @param {SVGCircleElement} circleElementParent Debe ser un elemento de tipo circulo parent de los commits, el commit previo al que se va a crear
     * @returns {SVGCircleElement} Elemento de tipo circulo con las propiedades de un commit
     */
    createCommit(circleElementParent){
        const newCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        newCircle.setAttribute("cx", parseInt(circleElementParent.getAttribute("cx")) + 70);
        newCircle.setAttribute("cy", parseInt(circleElementParent.getAttribute("cy")));
        newCircle.setAttribute("r", "20");
        newCircle.classList.add("commit");
        newCircle.id = this.createCod();
        return newCircle;   
    }
    initRepository(svgDocumentElement = document.getElementById("svg")){
        if(!svgDocumentElement)
            return
        svgDocumentElement.innerHTML= ''
        const gContainerPointer = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerPointer.id = "gContainerPointer";
        const gContainerCommit = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerCommit.id = "gContainerCommit";
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("class", "line");
        line.setAttribute("x1", "68");
        line.setAttribute("y1", "334");
        line.setAttribute("x2", "43");
        line.setAttribute("y2", "334");
        line.setAttribute("marker-end", "url(#triangle)");
        gContainerPointer.appendChild(line);
        const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        circle.setAttribute("class", "commit checked-out");
        circle.setAttribute("cx", "50");
        circle.setAttribute("cy", "334");
        circle.setAttribute("r", "20");
        circle.id = this.createCod();
        gContainerCommit.appendChild(circle);
        svgDocumentElement.appendChild(gContainerPointer);
        svgDocumentElement.appendChild(gContainerCommit);
    }
    /**
     * @name createLine
     * @description Crea un elemento svg de tipo linea con las propiedades de una linea, se le asigna un id unico y se retorna
     * @param {SVGCircleElement} circleElementParent Debe ser un elemento de tipo circulo parent de los commits, el commit previo al que se va a crear
     * @returns {SVGLineElement} Elemento de tipo linea con las propiedades de una linea
     */
    createLine(circleElementParent){
        const newLine = document.createElementNS("http://www.w3.org/2000/svg","line");
        newLine.classList.add("line");
        //Para que la linea quede apuntando a la derecha se le suma 68 a x1 y a x2 se le suma 25, pero para la animacion esos valores se ponen despues agregar al contenedor
        newLine.setAttribute("x1", parseInt(circleElementParent.getAttribute("cx"))+68);// x1 es el punto de inicio de la linea en x
        newLine.setAttribute("y1", parseInt(circleElementParent.getAttribute("cy")));// y1 es el punto de inicio de la linea en y
        newLine.setAttribute("x2", parseInt(circleElementParent.getAttribute("cx"))+25);// x2 es el punto final de la linea en x
        newLine.setAttribute("y2", parseInt(circleElementParent.getAttribute("cy")));// y2 es el punto final de la linea en y
        newLine.setAttribute("marker-end", "url(#triangle)");
        return newLine;
    }
        /**
     * @name lastCommit
     * @description Retorna el ultimo commit que se creo
     * @returns {SVGCircleElement} Elemento de tipo circulo con las propiedades de un commit
     */
    lastCommit() {
        const ultimo = document.querySelectorAll("circle");
        return ultimo[ultimo.length - 1];
    }
    /**
     * @name createCod
     * @description Crea un codigo de 7 caracteres aleatorios
     * @returns {string} Codigo de 7 caracteres aleatorios
     */
    createCod() {
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
    resizeSVG(){
        const oldWidth = parseInt(this._svg.getAttribute("width"));
        // Con esto renderiza mas de 100 commits
        svg.setAttribute("width", oldWidth + 70);
        svg.style.width = oldWidth + 70 + "px";
    }
    notify(){

    }
}
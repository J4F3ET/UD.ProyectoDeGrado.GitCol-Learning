import { isEmptyObject } from "../util.js";
export class DataViewer{
    constructor(svgContainer){
        this._logComands = localStorage.getItem('log');
        this._currentData = localStorage.getItem('repository');
        this._svg = this.createSVG();
        svgContainer.appendChild(this._svg);
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
     * @name notify
     * @description Triggers the notification of updates to the observers
     * @param {String} tag Tag to identify the notification
     * @param {String} data Data to send to the observers
     */
    notify(tag,data){
        if(tag == "log")
            this.updateLog(data);
        else
            this.updateSVG(data);
    }
    /**
     * @name createVSG
     * @description Crea el SVG y los containers para los commits, lineas y otros elementos del SVG 
     * @returns {SVGSVGElement} Elemento de tipo SVG con los containers para los commits, lineas y otros elementos del SVG
     */
    createSVG(){
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
     * @param {Object} dataCommit Debe ser un objeto con las propiedades de un commit
     * @example {id: "parent",parent: "init",message: "First commit",tags: ["master", "HEAD"],cx: 140,cy: 360};
     * @returns {SVGCircleElement} Elemento de tipo circulo con las propiedades de un commit
     */
    createCommit(dataCommit){
        const newCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        newCircle.setAttribute("cx", dataCommit.cx);
        newCircle.setAttribute("cy", dataCommit.cy);
        newCircle.setAttribute("r", "20");
        newCircle.classList.add("commit");
        newCircle.id = dataCommit.id;
        return newCircle;   
    }
    initRepository(svgDocumentElement){
        if(!svgDocumentElement)
            return
        svgDocumentElement.innerHTML= ''
        const gContainerPointer = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerPointer.id = "gContainerPointer";
        const gContainerTag = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerTag.id = "gContainerTag";
        const gContainerCommit = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerCommit.id = "gContainerCommit";
        const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        circle.setAttribute("cx", "-50");
        circle.setAttribute("cy", "334");
        circle.id = "init";
        circle.setAttribute("r", "0");
        gContainerCommit.appendChild(circle);
        svgDocumentElement.appendChild(gContainerPointer);
        svgDocumentElement.appendChild(gContainerTag);
        svgDocumentElement.appendChild(gContainerCommit);
    }
    /**
     * @name createLine
     * @description Create element SVG of type line with the properties of a line
     * @param {Object} dataCommit Debe ser un elemento de tipo circulo parent de los commits, el commit previo al que se va a crear
     * @example {id: "parent",parent: "init",message: "First commit",tags: ["master", "HEAD"],cx: 140,cy: 360};
     * @returns {SVGLineElement} Elemento de tipo linea con las propiedades de una linea
     */
    createLine(dataCommit){
        const parent = document.getElementById(dataCommit.parent);
        const newLine = document.createElementNS("http://www.w3.org/2000/svg","line");
        newLine.classList.add("line");
        //Para que la linea quede apuntando a la derecha se le suma 68 a x1 y a x2 se le suma 25, pero para la animacion esos valores se ponen despues agregar al contenedor
        newLine.setAttribute("x1", parseInt(dataCommit.cx)-24);// x1 es el punto de inicio de la linea en x
        newLine.setAttribute("y1", dataCommit.cy);// y1 es el punto de inicio de la linea en y
        newLine.setAttribute("x2", parseInt(parent.getAttribute("cx"))+28);// x2 es el punto final de la linea en x
        newLine.setAttribute("y2", parent.getAttribute("cy"));// y2 es el punto final de la linea en y
        newLine.setAttribute("marker-end", "url(#triangle)");
        newLine.id = dataCommit.parent+"-"+dataCommit.id;
        return newLine;
    }
    /**
     * @name createTag
     * @description Create element SVG of type text with the properties of a tag
     * @param {Object} dataCommit Debe ser un elemento de tipo circulo con las propiedades de un commit
     * @example {id: "parent",parent: "parent",message: "First commit",tags: ["master", "HEAD"],cx: 140,cy: 360};
     * @returns {SVGTextElement} Elemento de tipo texto con las propiedades de un tag
     */
    createTag(x,y,tagName){
        const newText = this.createText(x,y,tagName);
        const newRect = this.createRectTag(x,y);
        const newTag = document.createElementNS("http://www.w3.org/2000/svg","g");
        newTag.classList.add("branch-tag");
        if(tagName == "HEAD")
            newTag.classList.add("head-tag");
        newTag.appendChild(newRect);
        newTag.appendChild(newText);
        return newTag;
    }
    /**
     * @name createText
     * @description Create element SVG of type text with the properties of a text
     * @param {Int} x Position in the x axis
     * @param {Int} y Position in the y axis
     * @param {String} text Text to be added to the element
     * @returns {SVGTextElement} Elemento de tipo texto con las propiedades de un tag
     */
    createText(x,y,text){
        const newText = document.createElementNS("http://www.w3.org/2000/svg","text");
        newText.setAttribute("x", x);
        newText.setAttribute("y", y);
        newText.innerHTML = text;
        return newText;
    }
    /**
     * @name createRectTag
     * @description Create element SVG of type rect with the properties of a rect
     * @param {Int} x Position in the x axis
     * @param {Int} y Position in the y axis
     * @returns {SVGRectElement} Elemento de tipo rectangulo con las propiedades de un tag
     */
    createRectTag(x,y){
        const newRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
        newRect.setAttribute("x", x-20);// -20 para que el rectangulo quede centrado con el texto
        newRect.setAttribute("y", y-15); // -15 para que el rectangulo quede centrado con el texto
        newRect.setAttribute("width", "40");
        newRect.setAttribute("height", "20");
        return newRect;
    }
    /**
     * @name resizeSVG
     * @description Aumenta el ancho del SVG para que quepan mas commits
     * @param {SVGSVGElement} svgElement Elemento de tipo SVG
     */
    resizeSVG(){
        const maxCX = Math.max(...Array.from(this._svg.querySelectorAll(".commit")).map(commit => parseInt(commit.getAttribute("cx"))));
        this.svg.setAttribute("width", maxCX + 150);
        this.svg.style.width = maxCX + 150 + "px";
    }
    /**
     * @name createMessage
     * @description Create one message in the log container
     * @param {Object} log Object with the tag and the message
     * @example {tag: "error", message: "Error message"} 
     */
    createMessage(log){
        const p = document.createElement("p");
        p.innerHTML = log.message;
        p.classList.add(log.tag);
        if(log.tag == "comand")
            p.innerHTML = "$ "+ p.innerHTML;
        document.getElementById("logContainer").appendChild(p);
    }
    /**
     * @name updateLog
     * @description Update the log container with the new data
     * @param {String} data String with the new data, this data is a JSON string
     */
    updateLog(data){
        if(data == this.logComands)
            return
        document.getElementById("logContainer").innerHTML = "";
        JSON.parse(data).forEach(element => {
            this.createMessage(element);
        });
        this.logComands = data;
    };
    /**
     * @name updateSVG
     * @description Update the SVG with the new data
     * @param {String} data String with the new data, this data is a JSON string
     */
    updateSVG(data){
        if(data == this.currentData)
            return
        if(data != undefined)
            this.initRepository(this._svg);
        if(!isEmptyObject(JSON.parse(data)))
            this.renderSVG(JSON.parse(data));
        this.currentData = data;
        this.resizeSVG();
    }
    /**
     * @name renderSVG
     * @description Render the SVG with the new data.
     * @param {Object[]} data Array to commits
     */
    renderSVG(data){
        // Si entra a rendesSVG es porque ya existe el repositorio
        // La logica debe ser separada en lineas , commits, tags y branches
        // Se crea una linea paralela Cuando el current commit un hijo y a dicho commit se le agrega un hijo
        // Cada commit es un nodo y solo puede tener un padre y varios hijos 
        // Solo puede existir un HEAD
        const commitsCreated = document.querySelectorAll(".commit");
        if(commitsCreated.length == '0'){
            data.forEach(commit => {
                this.addCommitToSvg(commit);
            });
        }else{
            const commits = data.filter(commit => !commitsCreated.array.some(element => element.id == commit.id));
            commits.forEach(commit => {
                this.addCommitToSvg(commit);
            });
        }
    }
    addCommitToSvg(commit){
        this.addCircleToSvg(this.createCommit(commit));
        this.addLineToSvg(this.createLine(commit));
        const y = parseInt(commit.cy) + 40; 
        commit.tags.forEach((tag,index) => {// Create the tags by number of tags
            this.addTagToSvg(// Add the tag to the SVG container
                this.createTag(// Create the tag element
                    commit.cx,// Position in the x axis of the tag
                    y+(index*25),// Position in the y axis of the tag
                    tag// Text of the tag
                )
            );
        });
    }
    addCircleToSvg(commit){
        this._svg.getElementById("gContainerCommit").appendChild(commit)
    }
    addLineToSvg(line){
        this._svg.getElementById("gContainerPointer").appendChild(line)
    }
    addTagToSvg(tags){
        this._svg.getElementById("gContainerTag").appendChild(tags)
    }

}
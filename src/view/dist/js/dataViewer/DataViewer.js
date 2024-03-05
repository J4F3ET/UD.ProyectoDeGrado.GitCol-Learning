export class DataViewer{
    constructor(svgContainer){
        this._commitParent = {cx:-50,cy:334,id:"init",tags:[]}
        this._logComands = "";
        this._currentData = "";
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
        const widthSvg = window.innerWidth * 0.73;
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
        if(dataCommit.tags.includes("HEAD"))
            newCircle.classList.add("checked-out");
        else
            newCircle.classList.remove("checked-out");
        newCircle.classList.add("commit");
        newCircle.id = dataCommit.id;
        return newCircle;   
    }
    initRepository(svgDocumentElement){
        if(!svgDocumentElement)
            return
        svgDocumentElement.innerHTML= ''
        const gContainerData = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerData.id = "gContainerData";
        const gContainerPointer = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerPointer.id = "gContainerPointer";
        const gContainerTag = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerTag.id = "gContainerTag";
        const gContainerCommit = document.createElementNS("http://www.w3.org/2000/svg","g");
        gContainerCommit.id = "gContainerCommit";
        const commit = this.createCommit(this._commitParent)
        gContainerCommit.appendChild(commit);
        gContainerData.appendChild(this.createText(20,20,this._svg.getAttribute("id")));
        svgDocumentElement.appendChild(gContainerData);
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
    createLine(dataCommit,parent){
        const newLine = document.createElementNS("http://www.w3.org/2000/svg","line");
        newLine.classList.add("line");
        newLine.setAttribute("x1", parseInt(dataCommit.cx)-24);
        newLine.setAttribute("y1", dataCommit.cy);
        newLine.setAttribute("x2", parseInt(parent.cx)+28);
        newLine.setAttribute("y2", parent.cy);
        newLine.setAttribute("marker-end", "url(#triangle)");
        newLine.id = dataCommit.parent+"-"+dataCommit.id;
        return newLine;
    }
    /**
     * @name createTag
     * @description Create element SVG of type text with the properties of a tag
     * @param {Int} x Position in the x axis
     * @param {Int} y Position in the y axis
     * @param {String} tagName Text to be added to the element
     * @example createTag(50,50,"HEAD") // <g class="branch-tag" id="HEAD">...</g>
     * @returns {SVGTextElement} Elemento de tipo texto con las propiedades de un tag
     */
    createTag(x,y,tagName){
        const newTag = document.createElementNS("http://www.w3.org/2000/svg","g");
        const newText = this.createText(x,y,tagName );
        const newRect = this.createRectTag(x,y, this.widthText(tagName));
        newTag.classList.add("branch-tag");
        if(tagName == "HEAD")
            newTag.classList.add("head-tag");
        newTag.appendChild(newRect);
        newTag.appendChild(newText);
        newTag.id = tagName;
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
     * @name widthText
     * @description Get the width of the text
     * @param {String} text Text to get the width
     * @returns {Int} Width of the text
     * @example widthText("HEAD") // 30
     */
    widthText(text){
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "16px Arial";
        return context.measureText(text).width;
    }
    /**
     * @name createRectTag
     * @description Create element SVG of type rect with the properties of a rect
     * @param {Int} x Position in the x axis
     * @param {Int} y Position in the y axis
     * @returns {SVGRectElement} Elemento de tipo rectangulo con las propiedades de un tag
     */
    createRectTag(x,y,width = 40){
        const newRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
        newRect.setAttribute("x", x-(width/2));// -20 para que el rectangulo quede centrado con el texto
        newRect.setAttribute("y", y-15); // -15 para que el rectangulo quede centrado con el texto
        newRect.setAttribute("width", width);
        newRect.setAttribute("height", 20);
        return newRect;
    }
    /**
     * @name resizeSVG
     * @description Aumenta el ancho del SVG para que quepan mas commits
     * @param {SVGSVGElement} svgElement Elemento de tipo SVG
     */
    resizeSVG(){
        if(this._svg.querySelectorAll(".commit").length == 0 )
            return
        const maxCX = Math.max(...Array.from(
            this._svg.querySelectorAll(".commit")).map(
                commit => parseInt(commit.getAttribute("cx"))
            )
        ) + 150;
        if(maxCX < parseInt(this._svg.getAttribute("width")))
            return
        this._svg.setAttribute("width", maxCX);
        this._svg.style.width = maxCX + "px";
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
     * @name removesTags
     * @description Remove the tags that are not in the new data
     * @param {String[]} branchs Array with the tags to be removed
     */
    removesTags(branchs){
        const branchsInSvg = [...this._svg.querySelectorAll('.branch-tag')].map(branch => branch.id);
        branchsInSvg.forEach(branchInSvg => {
            if(!branchs.includes(branchInSvg))
                this._svg.getElementById(branchInSvg).remove()
        });
    }
    /**
     * @name updateLog
     * @description Update the log container with the new data
     * @param {String} data String with the new data, this data is a JSON string
     */
    updateLog(data){
        if(data == this._logComands)
            return
        document.getElementById("logContainer").innerHTML = "";
        JSON.parse(data).forEach(element => {
            this.createMessage(element);
        });
        this._logComands = data;
    };
    /**
     * @name updateSVG
     * @description Update the SVG with the new data
     * @param {String} data String with the new data, this data is a JSON string
     */
    updateSVG(data){
        if(data == this._currentData)return
        const dataParsed = JSON.parse(data);
        if(this._svg.getElementById("emptyContainer")){
            this.initRepository(this._svg);
            this.renderCommitsToSVG(dataParsed.commits);
            this.renderInfoToSVG(dataParsed.information);
            this._currentData = data;
            this.resizeSVG();
            return
        }
        const currentData = JSON.parse(this._currentData);
        const currentCommitsData = currentData==null?[]:currentData.commits ?? [];
        const currentInfoData = currentData==null?{}:currentData.information ?? {};
        if(dataParsed.commits != currentCommitsData)
            this.renderCommitsToSVG(dataParsed.commits,currentCommitsData)
        if(dataParsed.information != currentInfoData)
            this.renderInfoToSVG(dataParsed.information);
        this._currentData = data;
        this.resizeSVG();
    }
    /**
     * @name renderCommitsToSVG
     * @description Render the SVG with the new data.
     * @param {Object[]} commitsData Array with the commits data to be rendered
     * @param {Object[]} currentCommits Array with the current commits data to be rendered
     */
    renderCommitsToSVG(commitsData,currentCommits = null){
        if(!currentCommits){
            commitsData.forEach(commit => {
                const parent = commitsData.find(c => c.id === commit.parent)??this._commitParent
                this.addCommitToSvg(commit,parent);
            });
            return
        }
        this.removesTags(commitsData.map(commit => commit.tags).flat());
        commitsData.forEach((commit, index) => {
            if(
                currentCommits[index] == undefined || 
                JSON.stringify(currentCommits[index].tags) != JSON.stringify(commit.tags) ||
                currentCommits[index].cx != commit.cx ||
                currentCommits[index].cy != commit.cy
            ){
                const parent = commitsData.find(c => c.id === commit.parent)??this._commitParent
                this.addCommitToSvg(commit,parent);
            };
        });
    }
    /**
     * @name renderInfoToSVG    
     * @description Render the SVG with the new information
     * @param {Object} data Object with the information to be rendered
     * @example {head: "master", repository: "repositoryName"}
     */
    renderInfoToSVG(data){
        const gContainerData = this._svg.getElementById("gContainerData");
        const keys = Object.keys(data);
        keys.forEach((key,index) => {
            const gContainerText = document.createElementNS("http://www.w3.org/2000/svg","g");
            const xTitle = this.widthText(key);
            const xText =  this.widthText(data[key]) + (xTitle*2);
            const y = 30*(index+1);
            const titleProperty = this.createText(xTitle,y,`${key}:`);
            const textProperty = this.createText(xText,y,data[key]);
            gContainerData.querySelector(`#${key}`)?.remove();
            gContainerText.id = key;
            gContainerText.classList.add("container-text-data-repository");
            titleProperty.classList.add("title-property");
            textProperty.classList.add("text-property");
            gContainerText.appendChild(titleProperty);
            gContainerText.appendChild(textProperty);
            gContainerData.appendChild(gContainerText);
        });
    }
    addCommitToSvg(commit,parent){
        this.addCircleToSvg(this.createCommit(commit));
        this.addLineToSvg(this.createLine(commit,parent)); 
        this.addMessageAndIdToCommit(commit);
        const y = parseInt(commit.cy) + 60; 
        commit.tags.forEach((tag,index) => {
            this.addTagToSvg(this.createTag(commit.cx,y+(index*25),tag));
        });
    }
    addMessageAndIdToCommit(commit){
        if(this._svg.getElementById(commit.id+"-message")){
            this._svg.getElementById(commit.id+"-message").remove()
            this._svg.getElementById(commit.id+"-id").remove()
        }
        const message = this.createText(commit.cx,commit.cy+30,commit.message)
        const id = this.createText(commit.cx,commit.cy+40,commit.id)
        message.id = commit.id+"-message";
        id.id = commit.id+"-id";
        message.classList.add("message-label");
        id.classList.add("id-label");
        this._svg.getElementById("gContainerCommit").appendChild(message);
        this._svg.getElementById("gContainerCommit").appendChild(id);
    }
    addCircleToSvg(commit){
        this._svg.getElementById(commit.id)?.remove();
        this._svg.getElementById("gContainerCommit").appendChild(commit)
    }
    addLineToSvg(line){
        this._svg.getElementById("gContainerPointer").appendChild(line)
    }
    addTagToSvg(tag){
        this._svg.getElementById(tag.id)?.remove();
        this._svg.getElementById("gContainerTag").appendChild(tag)
    }

}
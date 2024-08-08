/**
 * @class
 * @classdesc Class to render the data in the SVG and the log container
 */
export class DataViewer{
    /**
     * @memberof DataViewer#
     * @name _svg
     * @member
     * @description SVG element to render the commits
     * @type {SVGSVGElement}
     * @default null
     * @readonly
     */
    _svg = null;
    /**
     * @memberof DataViewer#
     * @name _logComands
     * @member
     * @description Name of the reference the space to store the log commands
     * @type {String}
     * @default ""
     * @readonly
     */
    _logComands = "";
    /**
     * @memberof DataViewer#
     * @name _currentData
     * @member
     * @description Data that currently has the SVG, this data is a JSON string with the commits and the information
     * @type {String}
     * @default ""
     * @readonly
     * @example {"commits":[{id: "parent",parent: "init",message: "First commit",tags: ["master", "HEAD"],cx: 140,cy: 360}],information:{head: "master", repository: "repositoryName"}}
     */
    _currentData = "";
    /**
     * @memberof DataViewer#
     * @name _commitParent
     * @member
     * @description Object with the properties of the parent commit
     * @type {Object}
     * @default {cx:-50,cy:334,id:"init",tags:[],class:[]}
     * @readonly
     */
    _commitParent = {cx:-50,cy:334,id:"init",tags:[],class:[]}
    /**
     * @constructor
     * @description Create a new instance of the DataViewer
     * @param {HTMLElement} svgContainer Container to add the SVG
     */
    constructor(svgContainer){
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
     * @memberof DataViewer#
     * @method
     * @description Triggers the notification of updates to the observers
     * @param {String} tag Tag to identify the notification
     * @param {String} data Data to send to the observers
     */
    notify(data){
        if(data == null)
            return
        if(Object.hasOwn(JSON.parse(data),'commits'))
            this.updateSVG(data);
        else
            this.updateLog(data);
    }
    /**
     * @name createVSG
     * @memberof DataViewer#
     * @method
     * @description Create the SVG void
     * @returns {SVGSVGElement} Element SVG with the containers
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
     * @memberof DataViewer#
     * @method
     * @description Create element SVG of type circle with the properties of a commit
     * @param {Object} dataCommit Object with the properties of the commit
     * @example {id: "parent",parent: "init",message: "First commit",tags: ["master", "HEAD"],cx: 140,cy: 360};
     * @returns {SVGCircleElement} Element of type circle SVG with the properties of a commit
     */
    createCommit(dataCommit){
        const newCircle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        newCircle.setAttribute("cx", dataCommit.cx);
        newCircle.setAttribute("cy", dataCommit.cy);
        newCircle.setAttribute("r", "20");
        newCircle.classList.add(...dataCommit.class);
        newCircle.id = dataCommit.id;
        return newCircle;   
    }
    /**
     * @name initRepository
     * @memberof DataViewer#
     * @method
     * @description Initialize the repository with the SVG and the containers
     * @param {SVGSVGElement} svgDocumentElement Element SVG void before to be initialized with the containers
     * @example <svg id="svg" width="1000" height="1000" fill="none" xmlns="http://www.w3.org/2000/svg"></svg>
     * @returns {void}
     */
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
        const commit = this.createCommit(this._commitParent);
        gContainerCommit.appendChild(commit);
        gContainerData.appendChild(this.createText(20,20,this._svg.getAttribute("id")));
        svgDocumentElement.appendChild(gContainerData);
        svgDocumentElement.appendChild(gContainerPointer);
        svgDocumentElement.appendChild(gContainerTag);
        svgDocumentElement.appendChild(gContainerCommit);
    }
    /**
     * @name createLine
     * @memberof DataViewer#
     * @method
     * @description Create element SVG of type line with the properties of a line
     * @param {Object} dataCommit Object with the properties of the commit
     * @example {id: "parent",parent: "init",message: "First commit",tags: ["master", "HEAD"],cx: 140,cy: 360};
     * @returns {SVGLineElement} Element of type line SVG with the properties of a line
     */
    createLine(dataCommit,parent,listClass = ['line']){
        const newLine = document.createElementNS("http://www.w3.org/2000/svg","line");
        newLine.classList.add(...listClass);
        newLine.setAttribute("x1", dataCommit.cx);
        newLine.setAttribute("y1", dataCommit.cy);
        newLine.setAttribute("x2", parent.cx);
        newLine.setAttribute("y2", parent.cy);
        newLine.id = parent.id+"-"+dataCommit.id;
        this._svg.getElementById(newLine.id)?.remove();

        return newLine;
    }
    /**
     * @name createTag
     * @memberof DataViewer#
     * @method
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
        newTag.id = tagName+"-tag";
        return newTag;
    }
    /**
     * @name createText
     * @memberof DataViewer#
     * @method
     * @description Create element SVG of type text with the properties of a text
     * @param {Int} x Position in the x axis
     * @param {Int} y Position in the y axis
     * @param {String} text Text to be added to the element
     * @returns {SVGTextElement} Element type text SVG with the properties of a text
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
     * @memberof DataViewer#
     * @method
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
     * @memberof DataViewer#
     * @method
     * @description Create element SVG of type rect with the properties of a rect
     * @param {Int} x Position in the x axis
     * @param {Int} y Position in the y axis
     * @param {Int} width Width of the rect element by default is 40
     * @returns {SVGRectElement} Element of type rect SVG with the properties of a possition and a size
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
     * @memberof DataViewer#
     * @method
     * @description Resize the SVG to the maximum width of the commits
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
     * @memberof DataViewer#
     * @method
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
     * @memberof DataViewer#
     * @method
     * @description Update the log container with the new data
     * @param {String} data String with the new data, this data is a JSON string
     * @example '[{"tag":"comand","message":"git init"},{"tag":"info","message":"Repository created"}]'
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
     * @memberof DataViewer#
     * @method
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
     * @name getAllUnionsToCommit
     * @memberof DataViewer#
     * @method
     * @description Get all the unions of the commit
     * @param {Object[]} commits Array with the commits data
     * @param {Object} commit Object with the properties of the commit
     * @returns {Object[]} Array with the unions of the commit
     */
    getAllUnionsToCommit(commits,commit){
        return commits.filter(c => commit.unions.includes(c.id));
    };
    /**
     * @name renderCommitsToSVG
     * @memberof DataViewer#
     * @method
     * @description Render the SVG with the new data.
     * @param {Object[]} commitsData Array with the commits data to be rendered
     * @param {Object[]} currentCommits Array with the current commits data to be rendered
     */
    renderCommitsToSVG(commitsData,currentCommits = null){
        if(!currentCommits){
            commitsData.forEach(commit => {
                const parent = commitsData.find(c => c.id === commit.parent)??this._commitParent
                const unions = commit.unions?.length > 0 ? this.getAllUnionsToCommit(commitsData,commit):[]; 
                this.addCommitToSvg(commit,parent,unions);
            });
            return
        }
        commitsData.forEach((commit) => {
            const parent = commitsData.find(c => c.id === commit.parent)??this._commitParent
            const currentCommit = currentCommits.find(c => c.id === commit.id);
            const unions = commit.unions?.length > 0 ? this.getAllUnionsToCommit(commitsData,commit):[];
            if(currentCommit == undefined){
                return this.addCommitToSvg(commit,parent,unions);
            }
            if(
                JSON.stringify(currentCommit.tags) != JSON.stringify(commit.tags)||
                currentCommit.cy != commit.cy||
                JSON.stringify(currentCommit.class) != JSON.stringify(commit.class)||
                JSON.stringify(currentCommit.unions) != JSON.stringify(commit.unions)
            ){
                this.updateCommitToSvg(commit,parent,unions);
            };
        });
        this.removeElementsFromSVG(commitsData);
    }
    /**
     * @name removeElementsFromSVG
     * @memberof DataViewer#
     * @method
     * @description Remove elements from the SVG that are not in the new data
     * @param {Object[]} commitsData Array with the commits data to be rendered
     */
    removeElementsFromSVG(commitsData){
        const idsCommits = commitsData.map(commit => commit.id);
        const tagsInSVG = commitsData.map(commit => commit.tags).flat();
        this.removeLineFromSVG(idsCommits);
        this.removeTagsFromSVG(tagsInSVG);
        this.removeCommitsFromSVG(idsCommits);
    };
    /**
     * @name removeLineFromSVG
     * @memberof DataViewer#
     * @method
     * @description Remove lines from the SVG that are not in the new data
     * @param {String[]} idsCommits Array with the ids of the commits
     * @example ["parent","commit1","commit2"]
     * @returns {void}
     */
    removeLineFromSVG(idsCommits){
        const linesInSVG = Array.from(this._svg.querySelectorAll('.line,.union')).map(line => line.id);
        linesInSVG.forEach(line => {
            const ids = line.split("-");
            if(!idsCommits.includes(ids[1]) || !idsCommits.includes(ids[0])&&ids[0] != "init")
                this._svg.getElementById(line).remove();
        });
    }
    /**
     * @name removeTagsFromSVG
     * @memberof DataViewer#
     * @method
     * @description Remove tags from the SVG that are not in the new data
     * @param {String[]} tagsInData Array with the tags of the commits
     * @example ["master","HEAD"]
     * @returns {void}
     */
    removeTagsFromSVG(tagsInData){
        const tagsInSVG = Array.from(this._svg.querySelectorAll('.branch-tag')).map(tag => tag.id);
        tagsInSVG.forEach(tag => {
            if(!tagsInData.includes(tag.split("-")[0]))
                this._svg.getElementById(tag).remove();
        });
    }
    /**
     * @name removeCommitsFromSVG
     * @memberof DataViewer#
     * @method
     * @description Remove commits from the SVG that are not in the new data
     * @param {String[]} idsCommits Array with the ids of the commits
     * @example ["parent","commit1","commit2"]
     * @returns {void} 
     */
    removeCommitsFromSVG(idsCommits){
        const commitInSVG = Array.from(this._svg.querySelectorAll('.commit')).map(commit => commit.id);
        commitInSVG.forEach(commit => {
            if(!idsCommits.includes(commit)){
                this._svg.getElementById(commit).remove();
                this._svg.getElementById(commit+"-message").remove();
                this._svg.getElementById(commit+"-id").remove();
            }
        });
    }
    /**
     * @name renderInfoToSVG    
     * @memberof DataViewer#
     * @method
     * @description Render the SVG with the new information
     * @param {Object} data Object with the information to be rendered
     * @example {head: "master", repository: "repositoryName"}
     */
    renderInfoToSVG(data){
        const gContainerData = this._svg.getElementById("gContainerData");
        const keys = Object.keys(data).filter(key => key != "config");
        keys.reverse().forEach((key) => {
            if(data[key] == null)
                return
            const numElements = gContainerData.getElementsByTagNameNS("http://www.w3.org/2000/svg","g").length
            const gContainerText = document.createElementNS("http://www.w3.org/2000/svg","g");
            const xTitle = this.widthText(key) + 30;
            const widthText = this.widthText(data[key])
            const xText = widthText + (widthText>100?(widthText*0.6):(xTitle*1.5))
            const y = 35*(numElements+1);
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
    /**
     * @name updateCommitToSvg
     * @memberof DataViewer#
     * @method
     * @description Update the commit in the SVG with the new data
     * @param {Object} commit Object with the properties of the commit
     * @param {Object} parent Object with the properties of the parent commit
     * @return {void}
     */
    updateCommitToSvg(commit,parent,unions=[]){
        const commitSvg = this._svg.getElementById(commit.id);
        commitSvg.setAttribute("class",commit.class.join(" "));
        commitSvg.setAttribute("cy",commit.cy);
        this.updateMeesageAndIdToCommit(commit);
        unions.forEach(union => this.updateLineOfCommit(commit,union));
        this.updateLineOfCommit(commit,parent);
        this.resolveTagsInSVG(commit);
    }
    /**
     * @name resolveTagsInSVG
     * @memberof DataViewer#
     * @method
     * @description Resolve the tags in the SVG, add or update the tags
     * @param {Object} commit Object with the properties of the commit
     * @return {void}
     */
    resolveTagsInSVG(commit){
        const y = parseInt(commit.cy) + 60;
        const tagsInSvg = Array.from(this._svg.querySelectorAll('.branch-tag')).map(tag => tag.id);
        commit.tags.forEach((tag,index) => {
            if(tagsInSvg.includes(`${tag}-tag`))
                this.updateTagToSvg(tag,commit.cx,y+(index*25));
            else
                this.addTagToSvg(this.createTag(commit.cx,y+(index*25),tag));
        });
    }
    /**
     * @name addCommitToSvg
     * @memberof DataViewer#
     * @method
     * @description Add the commit to the SVG
     * @param {Object} commit Object with the properties of the commit
     * @param {Object} parent Object with the properties of the parent commit
     * @param {Object[]} unions Array with the unions of the commit
     * @return {void}
     */
    addCommitToSvg(commit,parent,unions=[]){
        unions.forEach(union => this.addLineToSvg(this.createLine(commit,union,['union'])));
        this.addCircleToSvg(this.createCommit(commit));
        this.addLineToSvg(this.createLine(commit,parent)); 
        this.addMessageAndIdToCommit(commit);
        this.resolveTagsInSVG(commit);
    }
    /**
     * @name updateMeesageAndIdToCommit
     * @memberof DataViewer#
     * @method
     * @description Update the message and the id of the commit
     * @param {Object} commit Object with the properties of the commit
     * @return {void}
     */
    updateMeesageAndIdToCommit(commit){
        const message = this._svg.getElementById(commit.id+"-message")
        const id = this._svg.getElementById(commit.id+"-id")
        this.animateElement(message,"x","y",message.getAttribute("x"),commit.cy+30);
        this.animateElement(id,"x","y",id.getAttribute("x"),commit.cy+40);
        message.innerHTML = commit.message;
    }
    /**
     * @name addMessageAndIdToCommit
     * @memberof DataViewer#
     * @method
     * @description Add the message and the id of the commit
     * @param {Object} commit Object with the properties of the commit
     * @return {void}
     */
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
    /**
     * @name addCircleToSvg
     * @memberof DataViewer#
     * @method
     * @description Add the circle to the SVG
     * @param {SVGCircleElement} commit Element of type circle SVG with the properties of a commit
     * @return {void}
     */
    addCircleToSvg(commit){
        this._svg.getElementById(commit.id)?.remove();
        this._svg.getElementById("gContainerCommit").appendChild(commit)
    }
    /**
     * @name updateLineOfCommit
     * @memberof DataViewer#
     * @method
     * @description Update the line of the commit
     * @param {Object} dataCommit Object with the properties of the commit
     * @param {Object} parent Object with the properties of the parent commit
     * @return {void}
     */
    updateLineOfCommit(dataCommit,parent){
        const line = this._svg.getElementById(dataCommit.parent+"-"+dataCommit.id);
        line.setAttribute("x1", dataCommit.cx);
        line.setAttribute("y1", dataCommit.cy);
        line.setAttribute("x2", parent.cx);
        line.setAttribute("y2", parent.cy);
    }
    /**
     * @name addLineToSvg
     * @memberof DataViewer#
     * @method
     * @description Add the line to the SVG
     * @param {SVGAElement} line Element of type line SVG with the properties of a line
     * @return {void}
     */
    addLineToSvg(line){
        this._svg.getElementById("gContainerPointer").appendChild(line)
    }
    /**
     * @name updateTagToSvg
     * @memberof DataViewer#
     * @method
     * @description Update the tag in the SVG
     * @param {String} tag Tag to identify the tag
     * @param {Int} x Position in the x axis
     * @param {Int} y Position in the y axis
     */
    updateTagToSvg(tag,x,y){
        const width = this.widthText(tag);
        const xRect = x-(width/2);
        const yRect = y-15;
        const tagSVG = this._svg.getElementById(tag+"-tag");
        this.animateElement(tagSVG.getElementsByTagName("text")[0],"x","y",x,y);
        this.animateElement(tagSVG.getElementsByTagName("rect")[0],"x","y",xRect,yRect);
    }
    /**
     * @name addTagToSvg
     * @memberof DataViewer#
     * @method
     * @description Add the tag to the SVG
     * @param {SVGTextElement} tag Element of type text SVG with the properties of a tag
     * @return {void}
     */
    addTagToSvg(tag){
        this._svg.getElementById(tag.id)?.remove();
        this._svg.getElementById("gContainerTag").appendChild(tag)
    }
    /**
     * @name animateElement
     * @memberof DataViewer#
     * @method
     * @description Animate the element in the SVG
     * @param {HTMLElement} element Element to be animated
     * @param {String} nameAttributeX Name of the attribute in the x axis to be animated("x" or "cx")
     * @param {String} nameAttributeY Name of the attribute in the y axis to be animated("y" or "cy")
     * @param {Int} finalX Final position in the x axis
     * @param {Int} finalY Final position in the y axis
     * @return {void}
     */
    animateElement(element,nameAttributeX,nameAttributeY, finalX, finalY) {
        const initialX = parseFloat(element.getAttribute(nameAttributeX));
        const initialY = parseFloat(element.getAttribute(nameAttributeY));
        const startTime = performance.now();
        const duration = 350;
        function updatePosition(currentTime) {
                const elapsedTime = currentTime - startTime;
                if (elapsedTime >= duration) {
                    element.setAttribute(nameAttributeX, finalX);
                    element.setAttribute(nameAttributeY, finalY);
                    return;
                }
            const progress = elapsedTime / duration;
            const newX = initialX + (finalX - initialX) * progress;
            const newY = initialY + (finalY - initialY) * progress;
            element.setAttribute(nameAttributeX, newX);
            element.setAttribute(nameAttributeY, newY);
            requestAnimationFrame(updatePosition);
        }
        requestAnimationFrame(updatePosition);
    }
}
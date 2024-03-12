import { currentHead,isEmptyObject } from "../../util.js";
export class Commit{
    SPACE_BETWEEN_COMMITS_X = 80;
    SPACE_BETWEEN_COMMITS_Y = 80;
    /**
     * @name constructor
     * @description The constructor of the class, it receives the repository of the data
     * @param {string} dataRepository Name variable of the local storage of the repository, by default is 'repository'
     */
    constructor(dataRepository = "repository",logRepository = "log") {
        this.comand = 'commit';
        this._configurations = {
            m:{
                message: "None",
                callback: this.callBackConfigMessage,
            },
            a:{
                files: ["index.html","style.css","script.js"],
                callback: this.callBackConfigFiles,
            },
        };
        this._dataRepository = dataRepository;
        this._logRepository = logRepository;
    }
    /**
     * @name resolveConfigure
     * @description Resolve the configuration of the command
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     * @example resolveConfigure(['-m','"message"','-a']) // ['m','a']
     * @returns {String[]} Array with the letters of the configuration
     */
    resolveConfigure(dataComand) {
        var configs = dataComand.filter(c => c.startsWith("-")||c.startsWith("--"));
        var cleanConfigs = [];
        configs.forEach(c => {
            if(c.startsWith("--")){
                cleanConfigs.push(c.replace("--",""));
            }else{
                cleanConfigs.push(...this.parseConfig(c));
            }
        });
        if(cleanConfigs.length == 0)
            throw new Error('The configuration is empty');
        cleanConfigs.forEach(configuration => {
            if(!Object.keys(this._configurations).includes(configuration))
                throw new Error(`The configuration "${configuration}" is not valid`);
        });
        return cleanConfigs;
    }
    /**
     * @name parseConfig
     * @description Parse the configuration of the command and return an array with the letters of the configuration
     * @param {String} configuracion Configuration of the command
     * @example parseConfig('-masds') // ['m','a','s','d','s']
     * @returns {String[]} Array with the letters of the configuration
     */
    parseConfig(configuracion) {
        const matches = configuracion.match(/-([a-z]+)/);
        if(matches && matches.length === 2)
            return matches[1].split('');
        return [];
    }
    /**
     * @name callBackConfigMessage
     * @description Callback to the configuration of the message
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     */
    callBackConfigMessage = (dataComand) =>{
        dataComand.forEach((data,index) => {
            if( this.parseConfig(data).includes('m')&&dataComand[index+1]!=undefined){
                this._configurations.m.message = dataComand[index+1];
                return;
            }
        });
    }
    /**
     * @name callBackConfigFiles
     * @description Callback to the configuration of the files
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     */
    callBackConfigFiles = () =>{
        const files = this._configurations.a.files.map(file => `<li>>${file}</li>`).join('');
        this.createMessageInfo('info',`<div class="files"><h5>Add files to the commit</h5><ul>${files}</ul></div>`);
    }
    /**
     * @name createMessageInfo
     * @description Create a message to the log
     * @param {String} tag Tag of the message
     * @param {String} message Message to be added to the log
     */
    createMessageInfo(tag,message){
        if(localStorage.getItem(this._logRepository)===null)
            return;
        const log = JSON.parse(localStorage.getItem(this._logRepository));
        log.push({tag,message});
        localStorage.setItem(this._logRepository,JSON.stringify(log));
    }
    /**
     * @name addCommitToStorage
     * @description Add a commit to the local storage
     * @param {object} commit Commit to be added to the local storage 
     */
    addCommitToStorage(commit){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits.push(commit);
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
    }
    /**
     * @name removeTag
     * @description Remove a tag from a commit
     * @param {string} tag Tag to be removed
     * @param {object} commit Commit to be removed the tag
     * @returns {object} Commit with the tag removed
     * @example removeTag('HEAD',commit) // {id: "parent", parent: "init", message: "First commit", tags: ["master"], cx: 50, cy: 334}
     */
    removeTag(tag,commit){
        commit.tags = commit.tags.filter(t => t != tag);
        return commit;
    }
    /**
     * @name addTag
     * @description Add a tag to a commit
     * @param {string} tag Tag to be added
     * @param {object} commit Commit to be added the tag
     * @returns {object} Commit with the tag added
     * @example addTag('HEAD',commit) // {id: "parent", parent: "init", message: "First commit", tags: ["master","HEAD"], cx: 50, cy: 334}
     */
    addTag(tag,commit){
        commit.tags.push(tag);
        return commit;
    }
    /**
     * @name updateCommitToStorage
     * @description Update a commit in the local storage
     * @param {object} newCommit New commit to be updated in the local storage
     * @returns {object} Commit updated in the local storage
     */
    updateCommitToStorage(newCommit){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits.forEach(oldCommit => {
            if(oldCommit.id == newCommit.id){
                Object.assign(oldCommit, newCommit);
            }
        });
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
    }
    /**
     * @name existsCommitToStorage
     * @description Check if a commit exists in the local storage
     * @param {object} commit Commit to be checked
     * @returns {boolean}
     */
    existsCommitToStorage(commit){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        return storage.commits.some(c => c.id == commit.id);
    }
    /**
     * @name createCod
     * @description Create a random code of 7 characters
     * @returns {string} Returns a random code of 7 characters
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
     * Create a new commit
     * @param {JSON} parent  Commit parent to create the new commit
     * @param {JSON[]} commits Array of commits
     * @returns {JSON} New commit created
     */
    createCommit(parent,tags) {
        return {
            id: this.createCod(),
            message: this._configurations.m.message,
            parent: parent.id,
            tags,
            cx : parseInt(parent.cx) + this.SPACE_BETWEEN_COMMITS_X,
            cy : parseInt(parent.cy)
        };
    }
    /**
     * @name resolveLocationCommit
     * @description 
     * @param {Int} parentCx
     * @param {Int} parentCy
     */
    resolveLocationCommit(parentCx,parentCy){
        //Caso 1
        const commits = localStorage.getItem(this._dataRepository).commits;
        const possibleX = parentCx + this.SPACE_BETWEEN_COMMITS_X;
        const commitThisUbicationX = commits.find(commit => commit.cx == possibleX && commit.cy == parentCy);
        if(commitThisUbicationX == undefined)
            return {
                cx: parentCx + this.SPACE_BETWEEN_COMMITS_X,
                cy: parentCy
            };
        //Caso 2
        const commitThisUbicationPossitiveY = commits.filter(commit => commit.cx == possibleX && commit.cy > parentCy);
        const commitThisUbicationNegativeY = commits.filter(commit => commit.cx == possibleX && commit.cy < parentCy);
        const commitThisUbicationOnParentPossitiveY = commits.filter(commit => commit.cx == parentCx && commit.cy > parentCy);
        const commitThisUbicationOnParentNegativeY = commits.filter(commit => commit.cx == parentCx && commit.cy < parentCy);
        if(commitThisUbicationOnParentPossitiveY == undefined &&  commitThisUbicationPossitiveY.length >= commitThisUbicationNegativeY.length){
            return {
                cx: possibleX,
                cy: parentCy + this.SPACE_BETWEEN_COMMITS_Y
            };
        }
        if(commitThisUbicationOnParentNegativeY == undefined && commitThisUbicationPossitiveY.length < commitThisUbicationNegativeY.length){
            return {
                cx: possibleX,
                cy: parentCy - this.SPACE_BETWEEN_COMMITS_Y
            };
        }
        //Caso 3
        
        
    }
    updateHeadToStorage(newHead){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.information.head = newHead;
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
    }
    /**
     * @name calculatePositionCommit
     * @description Calculate the position of the new commit
     * @param {JSON} parent Commit parent to create the new commit
     * @param {JSON[]} commits Array of commits
     * @returns {JSON} Position of the new commit
     */
    calculatePositionCommit(parent,commits){
        const commitThisUbicationX = commits.find(commit => commit.cx == parent.cx + this.SPACE_BETWEEN_COMMITS_X && commit.cy == parent.cy);
        const commitThisUbicationY = commits.find(commit => commit.cx == parent.cx + this.SPACE_BETWEEN_COMMITS_X && commit.cy == parent.cy + this.SPACE_BETWEEN_COMMITS_Y);
        var cx = parent.cx + this.SPACE_BETWEEN_COMMITS_X;

        if(commitThisUbicationX == undefined)
            return {
                cx: parent.cx + this.SPACE_BETWEEN_COMMITS_X,
                cy: parent.cy
            };
        if(commitThisUbicationY == undefined)
            return {
                cx: parent.cx,
                cy: parent.cy + this.SPACE_BETWEEN_COMMITS_Y
            };
    }
    /**
     * @name execute
     * @description Execute the command
     * @param {String[]} config Configuration of the command
     * @returns {JSON} New commit created
     */
    execute(dataComand){
        if(localStorage.getItem(this._dataRepository)===null)
            throw new Error('The repository does not exist');
        this.resolveConfigure(dataComand).forEach(config => {
            this._configurations[config].callback(dataComand);
        });
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));// Array of commits
        if(storage.commits.length == 0){
            this.updateHeadToStorage("master");
            this.addCommitToStorage({
                id: "parent",
                parent: "init",
                message: this._configurations.m.message,
                tags: ["master", "HEAD"],
                cx: 50,
                cy: 334,
            });
            return
        }
        var head = currentHead(storage.commits);
        const newCommit = this.createCommit(head,["HEAD",storage.information.head]);
        head = this.removeTag("HEAD",head);
        head = this.removeTag(storage.information.head,head);
        this.updateCommitToStorage(head);
        this.addCommitToStorage(newCommit);
        if(!this.existsCommitToStorage(newCommit)){
            throw new Error('Error in the command execution');
        }
    }
}
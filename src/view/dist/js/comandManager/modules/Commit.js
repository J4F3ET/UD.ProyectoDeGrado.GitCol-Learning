import { currentHead } from "../../util.js";
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
        let configs = [] 
        dataComand.forEach(c => {
            if(c.startsWith("-")||c.startsWith("--"))
                configs.push(c.replace(/^(-{1,2})([a-zA-Z])/, "$2").charAt(0))//Remove the "-" or "--" of the configuration and select second group 
        });
        this.validateConfig(configs);
        configs = configs.filter((c,i,self) => self.indexOf(c) === i);
        return configs;
    }
    /**
     * @name validateConfig
     * @description Validate the configuration of the command
     * @param {String[]} configs Array with the letters of the configuration
     * @example validateConfig(['m','a']) // true
     * @throws {Error} The configuration is empty
     * @throws {Error} The configuration "${config}" is not valid
     */
    validateConfig(configs){
        if(configs.length == 0)
            throw new Error('The configuration is empty');
        const currentConfig = Object.keys(this._configurations);
        configs.forEach(config => {
            if(!currentConfig.includes(config))
                throw new Error(`The configuration "${config}" is not valid`);
        });
    }
    /**
     * @name callBackConfigMessage
     * @description Callback to the configuration of the message
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     */
    callBackConfigMessage = (dataComand) =>{
        const indexConfig = dataComand.findIndex(data => data.includes('-m'));
        const message = dataComand[indexConfig+1];
        if(message == undefined || message == ""){
            throw new Error('The message is empty');
        }
        this._configurations.m.message = dataComand[indexConfig+1]
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
    createCommit(parent,currentHeadBranch){
        let tags = [currentHeadBranch,"HEAD"];
        const classList = ["commit","checked-out"];
        if(currentHeadBranch == "detached head"){
            tags = tags.filter(tag => tag != currentHeadBranch);
            classList.push("detached-head");
        }
        const [cx,cy] = this.resolveLocationCommit(parent.cx,parent.cy);
        return {
            id: this.createCod(),
            message: this._configurations.m.message,
            parent: parent.id,
            tags,
            class: classList,
            cx,
            cy
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
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        const possibleX = parentCx + this.SPACE_BETWEEN_COMMITS_X;
        if(commits.find(commit => commit.cx == possibleX && commit.cy == parentCy) == undefined)
            return[possibleX,parentCy];	
        //Caso 2
        const commitsInPossiteY = commits.filter(commit => commit.cx == possibleX && commit.cy < parentCy);
        const commitsInNegativeY = commits.filter(commit => commit.cx == possibleX && commit.cy > parentCy);
        const commitThisUbicationOnParentY = commits.filter(commit => commit.cx == parentCx && commit.cy != parentCy);
        if(commitThisUbicationOnParentY.length == 0)
            return [possibleX,this.generateLocationCommitCase2(parentCy,commitsInPossiteY,commitsInNegativeY)];
        //Caso 3
        return [possibleX,this.generateLocationCommitCase3(parentCy,commitsInPossiteY,commitsInNegativeY)];
    }
    /**
     * @name generateLocationCommitCase2
     * @description Generate the location "Y" of the commit in the case 2 
     * @param {Int} parentCy Coordenate "Y" of the parent commit(HEAD)
     * @param {JSON[]} commitsInPossiteY Commits that are above the "X" possible location
     * @param {JSON[]} commitsInNegativeY Commits that are below the "X" possible location
     * @returns {Int} Coordenate "Y" of the new commit
     */
    generateLocationCommitCase2(parentCy,commitsInPossiteY,commitsInNegativeY){
        if(commitsInPossiteY.length == 0)
            return parentCy - this.SPACE_BETWEEN_COMMITS_Y;
        if(commitsInNegativeY.length == 0)
            return parentCy + this.SPACE_BETWEEN_COMMITS_Y;
        if(commitsInPossiteY.length <= commitsInNegativeY.length)
            return commitsInPossiteY[commitsInPossiteY.length -1].cy - this.SPACE_BETWEEN_COMMITS_Y;
        else
            return commitsInNegativeY[commitsInNegativeY.length -1].cy + this.SPACE_BETWEEN_COMMITS_Y;
    }
    /**
     * @name generateLocationCommitCase3
     * @description Generate the location "Y" of the commit in the case 3
     * @param {Int} parentCy Coordenate "Y" of the parent commit(HEAD)
     * @param {JSON[]} commitsInPossiteY array of commits that are above the "X" possible location 
     * @param {JSON[]} commitsInNegativeY array of commits that are below the "X" possible location 
     * @returns {Int} Coordenate "Y" of the new commit
     */
    generateLocationCommitCase3(parentCy,commitsInPossiteY,commitsInNegativeY){
        if(commitsInPossiteY.length <= commitsInNegativeY.length){
            const SPACE_BETWEEN_COMMITS_Y_NEGATIVE = this.SPACE_BETWEEN_COMMITS_Y * (-1)
            commitsInPossiteY.forEach(commit => {
                this.updateLocationChildsOfCommit(SPACE_BETWEEN_COMMITS_Y_NEGATIVE,commit.id);
            });
            return parentCy - this.SPACE_BETWEEN_COMMITS_Y;
        }else{  
            commitsInNegativeY.forEach(commit => {
                this.updateLocationChildsOfCommit(this.SPACE_BETWEEN_COMMITS_Y,commit.id);
            });
            return parentCy + this.SPACE_BETWEEN_COMMITS_Y;
        }
    }
    /**
     * @name updateLocationChildsOfCommit
     * @description Update the location of the childs of a commit
     * @param {Int} SPACE_BETWEEN_COMMITS_Y Space between commits in the "Y" axis
     * @param {String} idCommitParent Id of the commit parent
     * @example updateLocationChildsOfCommit(80,"parent") // Update the location of the childs of the commit with id "parent"
     * @returns {void}
     */
    updateLocationChildsOfCommit(SPACE_BETWEEN_COMMITS_Y,idCommitParent){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        let commits = storage.commits;
        const childs = commits.filter(commit => commit.parent == idCommitParent);
        const commitParent = commits.find(c => c.id == idCommitParent);
        commitParent.cy = commitParent.cy + SPACE_BETWEEN_COMMITS_Y;
        if(childs.length != 0){
            childs.forEach(child => {
                this.updateLocationChildsOfCommit(SPACE_BETWEEN_COMMITS_Y,child.id);
            });
        }
        this.updateCommitToStorage(commitParent);
    }
    /**
     * @name updateHeadToStorage
     * @description Update the head of the repository
     * @param {String} newHead New head of the repository
     * @returns {void}
     */
    updateHeadToStorage(newHead){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.information.head = newHead;
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
    }
    remoteClassFromCommit(commit,classToRemove){
        commit.class = commit.class.filter(classC => classC !== classToRemove);
        return commit;
    };
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
                class: ["commit","checked-out"],
                cx: 50,
                cy: 334,
            });
            return
        }
        var head = currentHead(storage.commits);
        const newCommit = this.createCommit(head,storage.information.head);
        head = this.removeTag("HEAD",head);
        head = this.removeTag(storage.information.head,head);
        head = this.remoteClassFromCommit(head,"checked-out");
        this.updateCommitToStorage(head);
        this.addCommitToStorage(newCommit);
        if(!this.existsCommitToStorage(newCommit)){
            throw new Error('Error in the command execution');
        }
    }
}
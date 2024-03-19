import { currentHead } from "../../util.js";
export class Commit{
    SPACE_BETWEEN_COMMITS_X = 80;
    SPACE_BETWEEN_COMMITS_Y = 80;
    /**
     * @name constructor
     * @description The constructor of the class, it receives the repository of the data
     * @param {string} dataRepository Name variable of the local storage of the repository, by default is 'repository'
     */
    constructor(dataRepository = "repository",logRepository = "log"){
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
     * @name execute
     * @description Execute the command
     * @param {String[]} config Configuration of the command
     * @returns {JSON} New commit created
     */
    execute(dataComand){
        //console.time('Execution time of commit');
        if(localStorage.getItem(this._dataRepository)===null)
            throw new Error('The repository does not exist');
        this.resolveConfigure(dataComand).forEach(config => {
            this._configurations[config].callback(dataComand);
        });
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));// Array of commits
        if(storage.commits.length == 0){
            storage.information.head = "master";
            storage.commits.push({
                id: "parent",
                parent: "init",
                message: this._configurations.m.message,
                tags: ["master", "HEAD"],
                class: ["commit","checked-out"],
                cx: 50,
                cy: 334,
            });
            localStorage.setItem(this._dataRepository, JSON.stringify(storage));
            //console.timeEnd('Execution time of commit');
            return
        }
        var head = currentHead(storage.commits);
        const response = this.createCommit(storage.commits,head,storage.information.head);
        head = this.removeTags(["HEAD",storage.information.head],head);
        head = this.remoteClassFromCommit(head,"checked-out");
        storage.commits = this.updateCommitToStorage(response.commits,head);
        storage.commits.push(response.commit);
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
        //console.timeEnd('Execution time of commit');
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
     * @name removeTags
     * @description Remove a tag from a commit
     * @param {String[]} tag Tag to be removed
     * @param {JSON} commit Commit to be removed the tag
     * @returns {JSON} Commit with the tag removed
     */
    removeTags(tags,commit){
        tags.forEach(tag => {
            commit.tags = commit.tags.filter(t => t != tag)
        });
        return commit;
    }
    /**
     * @name updateCommitToStorage
     * @description Update a commit in the local storage
     * @param {JSON[]} commits Array of commits
     * @param {JSON} newCommit New commit to be updated in the local storage
     * @returns {JSON[]} Commit updated in the local storage
     */
    updateCommitToStorage(commits,newCommit){
        commits.forEach(oldCommit => {
            if(oldCommit.id == newCommit.id){
                Object.assign(oldCommit, newCommit);
            }
        });
        return commits
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
     * @name createCommit
     * @description Create a new commit and update the array of commits if it is necessary
     * @param {JSON} parent  Commit parent to create the new commit
     * @param {JSON[]} commits Array of commits
     * @returns {JSON} Commit created and the array of commits updated
     */
    createCommit(commits,parent,currentHeadBranch){
        let tags = [currentHeadBranch,"HEAD"];
        const classList = ["commit","checked-out"];
        if(currentHeadBranch == "detached head"){
            tags = tags.filter(tag => tag != currentHeadBranch);
            classList.push("detached-head");
        }
        const response = this.resolveLocationCommit(commits,parent.cx,parent.cy);
        return {commits:(response.commits),commit:{
            id: this.createCod(),
            message: this._configurations.m.message,
            parent: parent.id,
            tags,
            class: classList,
            cx:response.location[0],
            cy:response.location[1]
        }};
    }
    /**
     * @name resolveLocationCommit
     * @description Resolve the location of the commit, dividing the problem in 3 cases
     * @param {JSON[]} commits Array of commits
     * @param {Int} parentCx Coordenate "X" of the parent commit(HEAD)
     * @param {Int} parentCy Coordenate "Y" of the parent commit(HEAD)
     * @returns {JSON} Array of commits and the location of the new commit
     */
    resolveLocationCommit(commits,parentCx,parentCy){
        //Caso 1
        const possibleX = parentCx + this.SPACE_BETWEEN_COMMITS_X;
        if(commits.find(commit => commit.cx == possibleX && commit.cy == parentCy) == undefined)
            return {commits,location:[possibleX,parentCy]};	
        //Caso 2
        const commitsInPossiteY = commits.filter(commit => commit.cx == possibleX && commit.cy < parentCy);
        const commitsInNegativeY = commits.filter(commit => commit.cx == possibleX && commit.cy > parentCy);
        const commitThisUbicationOnParentY = commits.filter(commit => commit.cx == parentCx && commit.cy != parentCy);
        if(commitThisUbicationOnParentY.length == 0)
            return {commits,location:[possibleX,this.generateLocationCommitCase2(parentCy,commitsInPossiteY,commitsInNegativeY)]};
        //Caso 3
        const response = this.generateLocationCommitCase3(commits,parentCy,commitsInPossiteY,commitsInNegativeY);
        return {commits:(response.commits),location:[possibleX,response.cy]};
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
     * @description Generate the location "Y" of the commit in the case 3 and update the location of the childs of the commit
     * @param {JSON[]} commits Array of commits
     * @param {Int} parentCy Coordenate "Y" of the parent commit(HEAD)
     * @param {JSON[]} commitsInPossiteY array of commits that are above the "X" possible location 
     * @param {JSON[]} commitsInNegativeY array of commits that are below the "X" possible location 
     * @returns {JSON} Coordenate "Y" of the new commit and the array of commits updated
     */
    generateLocationCommitCase3(commits,parentCy,commitsInPossiteY,commitsInNegativeY){
        if(commitsInPossiteY.length <= commitsInNegativeY.length){
            const SPACE_BETWEEN_COMMITS_Y_NEGATIVE = this.SPACE_BETWEEN_COMMITS_Y * (-1)
            commitsInPossiteY.forEach(commit => {
                commits = this.updateLocationChildsOfCommit(commits,SPACE_BETWEEN_COMMITS_Y_NEGATIVE,commit.id);
            });
            return {commits,cy:(parentCy - this.SPACE_BETWEEN_COMMITS_Y)}; 
        }else{  
            commitsInNegativeY.forEach(commit => {
                commits = this.updateLocationChildsOfCommit(commits,this.SPACE_BETWEEN_COMMITS_Y,commit.id);
            });
            return {commits,cy: (parentCy + this.SPACE_BETWEEN_COMMITS_Y)};
        }
    }
    /**
     * @name updateLocationChildsOfCommit
     * @description Update the location of the childs of a commit
     * @param {JSON[]} commits Array of commits
     * @param {Int} SPACE_BETWEEN_COMMITS_Y Space between commits in the "Y" axis
     * @param {String} idCommitParent Id of the commit parent
     * @returns {JSON[]} Array of commits updated
     */
    updateLocationChildsOfCommit(commits,SPACE_BETWEEN_COMMITS_Y,idCommitParent){
        const childs = commits.filter(commit => commit.parent == idCommitParent);
        const commitParent = commits.find(c => c.id == idCommitParent);
        commitParent.cy = commitParent.cy + SPACE_BETWEEN_COMMITS_Y;
        if(childs.length != 0){
            childs.forEach(child => {
                commits = this.updateLocationChildsOfCommit(commits,SPACE_BETWEEN_COMMITS_Y,child.id);
            });
        }
        return this.updateCommitToStorage(commits,commitParent);
    }
    /**
     * @name remoteClassFromCommit
     * @description Remove a class from a commit
     * @param {JSON} commit Commit to be removed the class
     * @param {String} classToRemove Class to be removed
     * @returns {JSON} Commit with the class removed
     */
    remoteClassFromCommit(commit,classToRemove){
        return commit.class = commit.class.filter(classC => classC !== classToRemove); ;
    }
}
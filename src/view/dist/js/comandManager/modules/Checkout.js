import { currentHead } from '../../util.js';
export class Checkout {
    /**
     * @name constructor
     * @description Constructor to the class
     * @param {string} dataRepository Reference to the repository
     * @param {string} logRepository Reference to the log repository
    */
    constructor(dataRepository = "repository",logRepository = "log") {
        this.comand = "checkout";
        this._dataRepository = dataRepository;
        this._logRepository = logRepository;
        this._configurations = {
            q:{
                useConfig: false,
            },
            b:{
                nameBranch: null,
                callback: this.callbackCreateBranch
            }
        };
    }
    /** 
     * @name execute
     * @description Execute the command
     * @param {Array} dataComand Data of the command
     * @throws {Error} The repository does not exist
     * @throws {Error} The repository does not have commits
    */
    execute(dataComand){
        if(localStorage.getItem(this._dataRepository)===null)
            throw new Error('The repository does not exist');
        const storage = JSON.parse(localStorage.getItem(this._dataRepository))
        if(storage.commits.length == 0)
            throw new Error('The repository does not have commits');
        const goToObject = this.resolveConfig(dataComand);
        const commitCurrentHead = currentHead(storage.commits);
        const commitByBranch = this.findCommitByBranch(goToObject);
        const commitObjetive = commitByBranch??goToObject;
        this.updateHeadInformation(commitByBranch?goToObject:'detached head');
        if(commitObjetive !== commitCurrentHead.id){
            this.removeHeadTag(commitCurrentHead);
            this.goToCommit(commitObjetive);
        }
        if(this._configurations.b.nameBranch !== null){
            this._configurations.b.callback(this._configurations.b.nameBranch,storage.commits);
        }
        this.createMessageInfo(`Switched to '${commitByBranch?goToObject:commitObjetive}'`); 
        this.resetConfig();
    }
    /**
     * @name resolveConfig
     * @description Resolve the configurations of the command
     * @param {Array} dataComand Data of the command
     * @returns {string} The commit id to go or the name of the branch
     */
    resolveConfig(dataComand){
        dataComand.includes('-q',)||dataComand.includes('--quiet')?this._configurations.q.useConfig = true:null;
        if(dataComand.includes('-b')||dataComand.includes('--branch')){
            if(dataComand[dataComand.indexOf('-b')+1]===undefined)
                throw new Error('The name of the branch is required');
            this._configurations.b.nameBranch = dataComand[dataComand.indexOf('-b')+1];
        }
        return dataComand.filter(value => value.substring(0,1) !== '-').pop();
    }
    /**
     * @name updateHeadInformation
     * @description Update the head information in the repository
     * @param {string} nameBranch Name of the branch
     */
    updateHeadInformation(nameBranch){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.information.head = nameBranch;
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    /**
     * @name removeHeadTag
     * @description Remove the tag HEAD from the commit
     * @param {object} head Commit to remove the tag
     */
    removeHeadTag(head){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.filter(commit => commit.id !== head.id);
        head.tags = head.tags.filter(tag => tag !== 'HEAD');
        head.class = head.class.filter(classC => classC !== 'checked-out');
        storage.commits.push(head);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    /**
     * @name findCommitByBranch
     * @description Find the commit by the branch
     * @param {string} nameBranch Name of the branch
     * @returns {string} Id of the commit
     * @returns {undefined} If the branch does not exist
     */
    findCommitByBranch(nameBranch){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        return storage.commits.find(commit => commit.tags.includes(nameBranch))?.id;
    }
    /**
     * @name goToCommit
     * @description Change the current head to the commit
     * @param {string} id Id of the commit
     * @throws {Error} The commit does not exist
     * @returns {void}
     */
    goToCommit(id){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        const commit = storage.commits.find(commit => commit.id === id);
        if(commit === undefined)
            throw new Error('The commit does not exist');
        commit.tags.push('HEAD');
        commit.class.push('checked-out');
        storage.commits = storage.commits.filter(commit => commit.id !== id);
        storage.commits.push(commit);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    /**
     * @name createBranch
     * @description Create a new branch in the repository 
     * @param {string} name Name of the new branch
     */
    createBranch(name){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        const head = currentHead(storage.commits);
        storage.commits = storage.commits.filter(commit => commit.id !== head.id);
        head.tags.push(name);
        storage.commits.push(head);
        storage.information.head = name;
        if(head.class.includes("detached-head"))
            storage.commits = this.changeDetachedCommitToCommit(head,storage.commits)
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    /**
     * @name changeDetachedCommitToCommit
     * @param {JSON} commit 
     * @param {JSON[]} commits 
     * @returns {JSON[]}
     */
    changeDetachedCommitToCommit(commit,commits){
        if(!commit.class.includes("detached-head"))
            return commits
        let parent;
        const newListCommits = commits.map(c=>{
            if(c.id == commit.id)
                c.class = c.class.filter(item=> item !="detached-head")
            if(c.id == commit.parent)
                parent = c
            return c
        })
        return this.changeDetachedCommitToCommit(parent,newListCommits);
    }
    /**
     * @name createMessageInfo
     * @description Create a new message in the log
     * @param {string} message Message to add
     */
    createMessageInfo(message){
        if(this._configurations.q.useConfig)
            return
        const log = JSON.parse(localStorage.getItem(this._logRepository));
        log.push({tag: 'info',message: message});
        localStorage.setItem(this._logRepository,JSON.stringify(log));
    }
    /**
     * @name findBranch
     * @description Find a branch in the repository
     * @param {string} nameBranch Name of the branch to find
     * @returns {boolean} True if the branch exist, false otherwise
     */
    findBranch(nameBranch){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        return storage.commits.find(commit => commit.tags.includes(nameBranch))?true:false;
    }
    /**
     * @name callbackCreateBranch
     * @description Callback to create a new branch
     * @param {string} name Name of the new branch
     * @throws {Error} The branch already exist
     */
    callbackCreateBranch = (name) =>{
        if(!this.findBranch(name)){
            this.createBranch(name);
        }else{
            this.resetConfig();
            throw new Error(`Already exist the branch '${name}'`);
        }
    }
    /**
     * @name resetConfig
     * @description Reset the configurations
     */
    resetConfig(){
        this._configurations.q.useConfig = false;
        this._configurations.b.nameBranch = null;
    }
}
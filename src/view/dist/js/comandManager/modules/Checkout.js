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
                callback: ()=> this._configurations.q.useConfig = true
            },
            b:{
                nameBranch: null,
                callback: (name=null)=>this._configurations.b.nameBranch = name
            },
            h:{
                callback:this.callbackHelp
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
        //console.time('Execution time of checkout command');
        if(localStorage.getItem(this._dataRepository)===null)
            throw new Error('The repository does not exist');
        const storage = JSON.parse(localStorage.getItem(this._dataRepository))
        if(storage.commits.length == 0)
            throw new Error('The repository does not have commits');
        this.resetConfig;
        this.resolveConfig(dataComand);
        const {branch,commit} = this.resolveObjetiveToGo(storage.commits,dataComand);
        const commitCurrentHead = currentHead(storage.commits);
        storage.information.head = this._configurations.b.nameBranch??branch??`detached at ${commit.id}`;
        if(commit.id !== commitCurrentHead.id){
            storage.commits = this.goToCommit(
                this.removeHeadTag(
                    storage.commits,
                    commitCurrentHead
                    ),//Remove the tag HEAD from the commit, array of commits
                commit.id
            );
        }
        if(this._configurations.b.nameBranch !== null){
            storage.commits = this.createBranch(storage.commits,this._configurations.b.nameBranch);
            storage.information.head = this._configurations.b.nameBranch;
        }
        this.createMessageInfo(`Switched to '${this._configurations.b.nameBranch??branch??commit.id}'`);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
        //console.timeEnd('Execution time of checkout command');
    }
    /**
     * @name resolveConfig
     * @description Resolve the configurations of the command
     * @param {string[]} dataComand Data of the command
     * @returns {string} The commit id to go or the name of the branch
     */
    resolveConfig(dataComand){
        let clearConfig = new Map();
        dataComand.forEach((data,index) => {
            if(data.substring(0,1) == '-')
                clearConfig.set(
                    (data.replace(/^(-{1,2})([a-zA-Z])/, "$2").charAt(0)),
                    dataComand[index+1]	
                );
        });
        clearConfig.forEach((value,key) => {
            key=key=='o'?'b':key;
            if(this._configurations[key] === undefined)
                throw new Error(`The option '--${key}' does not exist`);
            this._configurations[key].callback(value);
        });
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
    resolveObjetiveToGo(commits,dataComand){
        const startPoint = dataComand.filter(value => value.substring(0,1) !== '-').pop();
        const commitByBranch = commits.find(commit => commit.tags.includes(startPoint));
        const commitObjetive = commitByBranch??commits.find(commit => commit.id === startPoint);
        return {branch:commitByBranch?startPoint:null,commit:commitObjetive};
    }
    /**
     * @name removeHeadTag
     * @description Remove the tag HEAD from the commit and remove the class "checked-out"
     * @param {JSON[]} commits Array of commits
     * @param {JSON} head Commit to remove the tag
     * @returns {JSON[]} Array of commits
     */
    removeHeadTag(commits,head){
        commits = commits.filter(commit => commit.id !== head.id);
        head.tags = head.tags.filter(tag => tag !== 'HEAD');
        head.class = head.class.filter(classC => classC !== 'checked-out');
        commits.push(head);
        return commits;
    }
    /**
     * @name goToCommit
     * @description Change the current head to the commit
     * @param {JSON[]} commits Array of commits
     * @param {string} id Id of the commit
     * @throws {Error} The commit does not exist
     * @returns {JSON[]} Array of commits with the new head
     */
    goToCommit(commits,id){
        const commit = commits.find(commit => commit.id === id);
        if(commit === undefined)
            throw new Error('The commit does not exist');
        commit.tags.push('HEAD');
        commit.class.push('checked-out');
        commits = commits.filter(commit => commit.id !== id);
        commits.push(commit);
        return commits;
    }
    /**
     * @name createBranch
     * @description Create a new branch in the repository
     * @param {JSON[]} commits Array of commits
     * @param {string} name Name of the new branch
     * @returns {JSON[]} Array of commits with the new branch
     */
    createBranch(commits,name){
        if(commits.some(commit => commit.tags.includes(name)))
            throw new Error(`Already exist the branch '${name}'`);
        const head = currentHead(commits);
        commits = commits.filter(commit => commit.id !== head.id);
        head.tags.push(name);
        commits.push(head);
        if(head.class.includes("detached-head"))
            commits = this.changeDetachedCommitToCommit(head,commits)
        return commits;
    }
    /**
     * @name changeDetachedCommitToCommit
     * @description Change the class of the commit "detached-head" recursively to the parent commit
     * @param {JSON} commit Commit to change the class
     * @param {JSON[]} commits Array of commits
     * @returns {JSON[]} Array of commits with the new class
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
     * @name callbackHelp
     * @description Callback to show the help
     */
    callbackHelp=()=>{
        const message = `
        <h5>Concept</h5>
        <p class="help">Switch branches or restore working tree files</p>
        <h5>Syntax</h5>
        <p class="help">git checkout [-q] [-b &lt;new-branch&gt;] &lt;start-point&gt;</p>
        <p class="help">git checkout [-h] </p>
        <h5>Concept</h5>
        <p class="help">Create an empty Git repository or reinitialize an existing one</p>
        <p class="help"><b>Start-point:</b> Can be a commit id or branch name</p>
        <h5>Syntax</h5>
        <p class="help">git init [-q | --quiet] [-h | --help]</p>
        <h5>Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">[-b | --orphan &lt;new-branch&gt;]&nbsp;&nbsp;&nbsp;Create a new branch with the name &lt;new-branch&gt;</li>
            <li class="help">[-q | --quiet]&nbsp;&nbsp;&nbsp;Only print error and warning messages; all other output will be suppressed.</li>
            <li class="help">[-h | --help]&nbsp;&nbsp;&nbsp;Show the help</li>
        </ul>`
        this.createMessageInfo(message);
        throw new Error('');
    }
    /**
     * @name resetConfig
     * @description Reset the configurations
     */
    resetConfig=()=>{
        this._configurations.q.useConfig = false;
        this._configurations.b.nameBranch = null;
    }
}
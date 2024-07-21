import { currentHead,getCommitStartPoint,createMessage,changeDetachedCommitToCommit} from './utils.js';
/**
 * @class
 * @classdesc This class is responsible for switching branches or restoring working tree files
 * @requires utils
 */
export class Checkout {
    _comand = 'checkout';
    /**
     * @typedef {Object} _configurationsOfCheckout
     * @memberof! Checkout#
     * @description Configurations of the command checkout. The configuration that supported by the command
     * @property {Object<Boolean,Function>} q Quiet, only print error and warning messages; all other output will be suppressed. Default is false. It is configured by the option '-q' or '--quiet'
     * @property {Boolean} q.useConfig Indicate that the quiet option was used. Default is false
     * @property {Function} q.callback Callback to set the quiet option to true
     * @property {Object<String,Function>} b Branch, create a new branch with the name <new-branch>
     * @property {String} b.nameBranch Name of the new branch
     * @property {Function} b.callback Callback to set the name of the branch
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     */
    _configurations = {
        q:{
            useConfig: false,
            callback: ()=> this._configurations.q.useConfig = true
        },
        b:{
            nameBranch: null,
            callback: (name=null)=>this._configurations.b.nameBranch = name
        },
        h:{
            callback:()=>this.callbackHelp()
        }
    };
    /**
     * @type {string}
     * @description Name of the repository
     * @default 'repository'
     * @memberof! Checkout#
     * @readonly
     */
    _dataRepository = 'repository';
    /**
     * @type {string}
     * @description Name of the log
     * @default 'log'
     * @memberof! Checkout#
     * @readonly
     */
    _logRepository = 'log';
    /**
     * @constructor
     * @param {string} dataRepository Name of the repository
     * @param {string} logRepository Name of the log
     * @description Create a new instance of Checkout
     * @memberof! Checkout#
     * @example new Checkout('repository','log')
     * @example new Checkout()
     * @example new Checkout('repository')
     * @example new Checkout('repository','log')
     */
    constructor(dataRepository,logRepository) {
        this._dataRepository = dataRepository;
        this._logRepository = logRepository;
    }
    /**
     * @name comand
     * @description Get the name of the command
     * @returns {string} Name of the command
     * @memberof! Checkout#
    */
    get comand (){return this._comand}
    /** 
     * @name execute
     * @description Execute the command
     * @param {string[]} dataComand Data of the command
     * @throws {Error} The repository does not exist
     * @throws {Error} The repository does not have commits
     * @throws {Error} The start-point does not exist
     * @method
     * @memberof! Checkout#
    */
    execute(dataComand){
        //console.time('Execution time of checkout command');
        if(localStorage.getItem(this._dataRepository)===null)
            throw new Error('The repository does not exist');
        const storage = JSON.parse(localStorage.getItem(this._dataRepository))
        if(storage.commits.length == 0)
            throw new Error('The repository does not have commits');
        this.resetConfig();
        this.resolveConfigurations(dataComand);
        const {branch,commit} = this.resolveObjetiveToGo(storage.commits,dataComand);
        if(commit === undefined)
            throw new Error(`The star-point "${dataComand.pop()}" does not exist`);
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
        createMessage(this._logRepository,'info',`Switched to '${this._configurations.b.nameBranch??branch??commit.id}'`);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
        //console.timeEnd('Execution time of checkout command');
    }
    /**
     * @name resolveConfigurations
     * @method
     * @memberof! Checkout#
     * @description Resolve the configurations of the command
     * @param {string[]} dataComand Data of the command
     * @returns {string} The commit id to go or the name of the branch
     */
    resolveConfigurations(dataComand){
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
     * @name resolveObjetiveToGo
     * @method
     * @memberof! Checkout#
     * @description Resolve the objective to go, the branch or the commit
     * @param {JSON[]} commits Array of commits
     * @param {string[]} dataComand Data of the command
     * @returns {{branch:(string|null),commit:JSON}} The name of the branch  or null and the object of the commit
     */
    resolveObjetiveToGo(commits,dataComand){
        const commitStartPoint = getCommitStartPoint(dataComand,commits);
        const startPoint = dataComand[dataComand.length-1];
        if(commitStartPoint === undefined)
            throw new Error(`The start-point ${startPoint} does not exist`);
        const commitByBranch = commits.find(commit => commit.tags.includes(startPoint));
        return {branch:commitByBranch?startPoint:null,commit:commitStartPoint};
    }
    /**
     * @name removeHeadTag
     * @method
     * @memberof! Checkout#
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
     * @method
     * @memberof! Checkout#
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
     * @method
     * @memberof! Checkout#
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
            commits = changeDetachedCommitToCommit(head,commits)
        return commits;
    }
    /**
     * @name callbackHelp
     * @description Callback to show the help
     * @memberof! Checkout#
     * @throws {Error} Throw a error to stop the execution of the command
     * @callback callbackHelp
     */
    callbackHelp=()=>{
        const message = `
        <h5>Concept</h5>
        <p class="help">Switch branches or restore working tree files</p>
        <p class="help"><b>Start-point:</b> Can be a commit id or branch name</p>
        <h5>Syntax</h5>
        <p class="help">git checkout [-q] [-b &lt;new-branch&gt;] &lt;start-point&gt;</p>
        <p class="help">git checkout [-h] </p>
        <h5>Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">-b, --orphan &lt;new-branch&gt;]&nbsp;&nbsp;&nbsp;Create a new branch with the name &lt;new-branch&gt;</li>
            <li class="help">-q, --quiet&nbsp;&nbsp;&nbsp;Only print error and warning messages; all other output will be suppressed.</li>
            <li class="help">-h, --help&nbsp;&nbsp;&nbsp;Show the help</li>
        </ul>`
        createMessage(this._logRepository,'info',message);
        throw new Error('');
    }
    /**
     * @name resetConfig
     * @description Reset the configurations
     * @memberof! Checkout#
     * @callback resetConfig
     */
    resetConfig=()=>{
        this._configurations.q.useConfig = false;
        this._configurations.b.nameBranch = null;
    }
}
import { 
    createMessage,
    currentHead,
    findAllParents,
    getCommitStartPoint,
    createRegister,
    removeTags,
    changeDetachedCommitToCommit,
    updateHead
} from "./utils"
/**
 * @class
 * @classesc Join two or more development histories together
 * @requires utils
 */
export class Merge {
    _comand = 'merge'
    /**
     * @memberof Merge#
     * @description Member is responsible of save the configurations of the merge
     * @tydef {Object} _configurationsOfMerge
     * @property {Object<Function>} h
     * @property {Function} h.callback
     */
    _configurations = {
        h:{
            callback: ()=>{}
        }
    }
    /**
     * @memberof Merge#
     * @description Member is responsible of save the name of the reference repository
     * @member
     * @property {String} _dataRepository
     * @default 'repository'
     */
    _dataRepository = 'repository'
    /**
     * @memberof Merge#
     * @description Member is responsible of save the name of the log repository
     * @member
     * @property {String} _logRepository
     * @default 'log'
     */
    _logRepository = 'log'
    /**
     * @memberof Merge#
     * @description Returns of intance of the class
     * @param {string} dataRepository
     * @param {string} logRepository
     * @constructor
     */
    constructor(dataRepository = 'repository', logRepository = 'log'){
        this._dataRepository = dataRepository
        this._logRepository = logRepository
    }
    /**
     * @memberof Merge#
     * @name execute
     * @method
     * @description Execute the merge command
     * @param {string[]} dataComand
     * @throws {Error} The repository is not initialized
     * @throws {Error} There are no branch master
     */
    execute(dataComand){
        let storage = JSON.parse(localStorage.getItem(this._dataRepository));
        if(!storage)
            throw new Error('The repository is not initialized');
        if(storage.commits.length === 0)
            throw new Error('There are no branch master');
        this.resolveConfiguration(dataComand);
        const commitFetch = getCommitStartPoint(dataComand, storage.commits);
        if(commitFetch === null)
            throw new Error('The commit does not exist');
        const parentsCommitFetch = findAllParents(storage.commits, commitFetch).map(commit=>commit.id);
        const commitHead = currentHead(storage.commits);
        const parentsCommitHead = findAllParents(storage.commits, commitHead).map(commit=>commit.id);
        if(parentsCommitHead.includes(commitFetch.id))
            throw new Error('Already up to date');
        if(parentsCommitFetch.includes(commitHead.id))
            storage = this.resolveMovilityTag(storage, commitFetch, commitHead,dataComand.pop());
        else
            storage = this.resolveCreateRegister(storage, commitFetch, commitHead,dataComand.pop());
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
    }
    /**
     * @memberof Merge#
     * @name resolveMovilityTag
     * @method
     * @description Resolve the movility tag in case that the commit fetch is a parent of the commit head
     * @param {Object} storage Data of the repository
     * @param {JSON} commitFetch Commit fetch
     * @param {JSON} commitHead Commit head
     * @returns {Object} newStorage
     */
    resolveMovilityTag(storage, commitFetch, commitHead,startPoint){
        if(commitFetch.class.includes('detached-head')){
            storage.commits = changeDetachedCommitToCommit(commitFetch, storage.commits);
        }
        if(commitHead.tags.includes(startPoint)){
            commitFetch.tags.push(startPoint);
            commitHead.tags = removeTags(startPoint,commitHead.tags);
        }
        // The head isn't detached and the start point is a tag(branch)
        storage.commits = updateHead(storage.commits,commitHead, commitFetch.id);
        return storage;
    }
    /**
     * @memberof Merge#
     * @name resolveCreateRegister
     * @method
     * @description Resolve the creation of the register in case that the commit fetch isn't parent of the commit head
     * @param {Object} storage Data of the repository
     * @param {JSON} commitFetch Commit fetch
     * @param {JSON} commitHead Commit head
     * @returns {Object} newStorage
     */
    resolveCreateRegister(storage, commitFetch, commitHead,startPoint){
        console.log('create register');
    }

    /**
     * @memberof Merge#
     * @name resolveConfiguration
     * @method
     * @description Resolve the configurations of the merge
     * @param {string[]} dataComand
     */
    resolveConfiguration(dataComand){
        if(dataComand.includes('-h'))
            this._configurations.h.callback();
    }
    /**
     * @memberof Merge#
     * @name callbackHelp
     * @callback Merge~callbackHelp
     * @description Show the message of help
     * @param {string} message
     */
    callbackHelp = ()=>{
        let message = `
        <h5>Concept</h5>
        <p class="help">Join two or more development histories together</p>
        <p class="help"><b>Start-point:</b> Can be a commit id or branch name</p>
        <h5>Syntax</h5>
        <p class="help">git merge <start-point></p>
        <p class="help">git merge -h</p>
        <h5>Configurations</h5>
        <ul>
            <li><p class="help">-h,--help &nbsp;&nbsp;&nbsp;Show the message</p></li>
        </ul>`;
        createMessage(message);
        throw new Error('');
    }
}

    
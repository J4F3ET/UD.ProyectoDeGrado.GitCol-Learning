import { 
    createMessage,
    findCommitsDiffBetweenRepositories,
    getRepository,
    mergeChangesInRepositories,
    resolveIsHeadNull
} from "./utils.js";
/**
 * @class
 * @classdesc Download objects and refs from another repository
 */
export class Fetch {
    _comand = 'fetch'
    /**
     * @typedef {Object} _configurationsOfFetch
     * @property {Object<Boolean,Function>} q Quiet, only print error and warning messages; all other output will be suppressed.
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     * @alias _configurations
     * @readonly
     * @memberof! Init#
    */
    _configurations = {
        h:{
            callback: ()=>{this.callbackHelp()}
        }
    }
        /**
     * @type {string}
     * @description Name of the repository
     * @default 'repository'
     * @memberof! Pull#
     * @readonly
     */
    _dataRepository = 'repository'
    /**
     * @type {string}
     * @description Name of the log repository
     * @default 'log'
     * @memberof! Pull#
     * @readonly
     */
    _logRepository = 'log'
    /**
     * @type {string}
     * @description Name of the remote repository
     * @default 'origin'
     * @memberof! Pull#
     * @readonly
     */
    _remoteRepository = 'origin';
    /**
     * @constructor
     * @param {string} dataRepository Name of the space where the repository will be saved
     * @param {string} logRepository Name of the space where the log will be saved
     * @description Create a new instance of Pull
     */
    constructor(dataRepository, logRepository, remoteRepository){
        this._dataRepository = dataRepository
        this._logRepository = logRepository
        this._remoteRepository = remoteRepository
    }
    async resolveTags(changesId,commits){
        const refRemote = this._remoteRepository.split("-")[0]
        commits.forEach( commit =>{
            if(!changesId.some(id => id == commit.id)){
                if(!commit.tags.length) return
                commit.tags = commit.tags.filter(t => 
                    !t.includes(refRemote)
                )
            }else{
                commit.tags = commit.tags.map(t => {
                    if(t == "HEAD") return t
                    return refRemote + "/" + t
                });
            }
        })
        return commits
    }
    async execute(data){
        
        const repository = await getRepository(this._dataRepository);
        const remote = await getRepository(this._remoteRepository);

        if(!repository || !remote)
            throw new Error('The repository is not initialized<br>Please initialize the repository first');

        if(!(await findCommitsDiffBetweenRepositories(repository.commits, remote.commits)).length)
            return createMessage(this._logRepository,'info','Already up to date.');

        repository.commits = await this.resolveTags(...Object.values(
            await mergeChangesInRepositories(repository.commits,remote.commits)
        ))
        
        sessionStorage.setItem(
            this._dataRepository,
            JSON.stringify(
                !repository.information.head
                    ?await resolveIsHeadNull(repository)
                    :repository
                )
        )
    }

    callbackHelp = async()=>{
        createMessage('info', `
            <h5>Concept</h5>
            <p class="help">Download objects and refs from another repository</p>
            <h5>Syntax</h5>
            <p class="help">git fetch</p>
            <p class="help">git fetch -h</p>
            <h5>Configurations</h5>
            <ul>
                <li><p class="help">-h,--help &nbsp;&nbsp;&nbsp;Show the message</p></li>
            </ul>`
        )
    }
}
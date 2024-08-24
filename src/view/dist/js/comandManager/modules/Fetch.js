import { 
    createMessage,
    findCommitsDiffBetweenRepositories,
    getRepository,
    mergeChangesInRepositories,
    implementTagsRemotesInRepository,
    resolveIsHeadNull,
    findCommitsChangeWithTags,
    findCommitsHead
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
     * @memberof! Fetch#
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
     * @memberof! Fetch#
     * @readonly
     */
    _dataRepository = 'repository'
    /**
     * @type {string}
     * @description Name of the log repository
     * @default 'log'
     * @memberof! Fetch#
     * @readonly
     */
    _logRepository = 'log'
    /**
     * @type {string}
     * @description Name of the remote repository
     * @default 'origin'
     * @memberof! Fetch#
     * @readonly
     */
    _remoteRepository = 'origin';
    /**
     * @constructor
     * @memberof! Fetch#
     * @param {string} dataRepository Name of the space where the repository will be saved
     * @param {string} logRepository Name of the space where the log will be saved
     * @description Create a new instance of Pull
     */
    constructor(dataRepository, logRepository, remoteRepository){
        this._dataRepository = dataRepository
        this._logRepository = logRepository
        this._remoteRepository = remoteRepository
    }
    /**
     * @name execute
     * @description Execute the command
     * @method 
     * @throws {Error}
     * @memberof! Fetch#
     */
    async execute(){
        
        const repository = await getRepository(this._dataRepository);
        const remote = await getRepository(this._remoteRepository);

        if(!repository || !remote)
            throw new Error('The repository is not initialized<br>Please initialize the repository first');

        const refRemote = this._remoteRepository.split("-")[0]
        const commitsDiff = await findCommitsDiffBetweenRepositories(repository.commits, remote.commits)
        const headsLocal = await findCommitsHead(repository.commits,refRemote)
        const headsRemote = await findCommitsHead(remote.commits)
        const headsDiff = headsRemote.difference(headsLocal)


        if(!commitsDiff.length && !headsDiff.size)
            return createMessage(this._logRepository,'info','Already up to date.');

        if(!commitsDiff.length && headsDiff.size)
            repository.commits = await implementTagsRemotesInRepository(
                refRemote,
                headsRemote,
                await findCommitsChangeWithTags(
                    remote.commits,
                    headsDiff
                ),
                repository.commits
            )
        else
            repository.commits = await implementTagsRemotesInRepository(
                refRemote,
                headsRemote,
                ...Object.values(await mergeChangesInRepositories(
                    repository.commits,
                    remote.commits
                )
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
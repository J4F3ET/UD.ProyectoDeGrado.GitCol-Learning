import { 
    createMessage,
    findLatestCommitsOfBranchs,
    findCommitsDiffBetweenRepositories
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

    execute(data){
        //console.time('Execution time of commit');
        let repository = JSON.parse(localStorage.getItem(this._dataRepository));
        let remote = JSON.parse(localStorage.getItem(this._remoteRepository));
        if(!repository || !remote)
            throw new Error('The repository is not initialized<br>Please initialize the repository first');
        const diff = findCommitsDiffBetweenRepositories(repository.commits, remote.commits);
        console.log(diff);
        if(diff.length == 0){
            console.log('Already up to date.');
            createMessage(this._logRepository,'info','Already up to date.');
            return;
        }
        //console.timeEnd('Execution time of commit');
        const lastcommits = findLatestCommitsOfBranchs(repository.commits);
        console.log(lastcommits);
    }

    callbackHelp(){
        createMessage('info', 'The pull command is used to fetch from and integrate with another repository or a local branch', 'pull [options] [<repository> [<refspec>…​]]')
    }
}
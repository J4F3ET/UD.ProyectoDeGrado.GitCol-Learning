import { createMessage } from "./utils.js";
/**
 * @class
 * @classdesc Fetch from and integrate with another repository or a local branch
 */
export class Push {
    _comand = 'push'
    /**
     * @typedef {Object} _configurationsOfPush
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     * @alias _configurations
     * @readonly
     * @memberof! Push#
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
     * @memberof! Push#
     * @readonly
     */
    _dataRepository = 'repository'
    /**
     * @type {string}
     * @description Name of the log repository
     * @default 'log'
     * @memberof! Push#
     * @readonly
     */
    _logRepository = 'log'
    /**
     * @type {string}
     * @description Name of the remote repository
     * @default 'origin'
     * @memberof! Push#
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

    execute(dataComand){
        console.log('Push', dataComand)
    }

    callbackHelp(){
        createMessage(this._remoteRepository,'info', 'The pull command is used to fetch from and integrate with another repository or a local branch', 'pull [options] [<repository> [<refspec>…​]]')
    }
}
import { createMessage } from "./utils.js";
/**
 * @class
 * @classdesc Fetch from and integrate with another repository or a local branch
 */
export class Pull {
    _comand = 'pull'
    /**
     * @typedef {Object} _configurationsOfPull
     * @property {Object<Boolean,Function>} q Quiet, only print error and warning messages; all other output will be suppressed.
     * @property {Boolean} q.quiet Indicate that the quiet option was used. Default is false
     * @property {Function} q.callback Callback to set the quiet option to true
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     * @alias _configurations
     * @readonly
     * @memberof! Init#
    */
    _configurations = {
        h:{
            callback: ()=>{this.callbackHelp()}
        },
        q:{
            quiet:false,
            callback:()=>this._configurations.q.quiet=true,
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
     * @constructor
     * @param {string} dataRepository Name of the space where the repository will be saved
     * @param {string} logRepository Name of the space where the log will be saved
     * @description Create a new instance of Pull
     */
    constructor(dataRepository, logRepository){
        this._dataRepository = dataRepository
        this._logRepository = logRepository
    }

    execute(){}

    callbackHelp(){
        createMessage('Pull', 'The pull command is used to fetch from and integrate with another repository or a local branch', 'pull [options] [<repository> [<refspec>…​]]')
    }
}
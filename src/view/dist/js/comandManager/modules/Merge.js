import { createMessage } from "./utils"
/**
 * @class
 * @classesc Class responsible for managing the merge command of git in the terminal
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
     * @description
     * @param {string[]} dataComand
     */
    execute(dataComand){}
    /**
     * @memberof Merge#
     * @name resolveConfiguration
     * @method
     * @description
     * @param {string[]} dataComand
     */
    resolveConfiguration(dataComand){}
}

    
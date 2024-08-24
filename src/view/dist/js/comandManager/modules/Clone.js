import { SocketHandler } from "../SocketHandler.js";
import { createMessage, getRepository } from "./utils.js";
/**
 * @class
 * @classdesc Fetch from and integrate with another repository or a local branch
 */
export class Clone {
    _comand = 'Clone'
    /**
     * @typedef {Object} _configurationsOfClone
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     * @alias _configurations
     * @readonly
     * @memberof! Clone#
    */
    _configurations = {
        h:{
            callback: async ()=>{this.callbackHelp()}
        }
    }
        /**
     * @type {string}
     * @description Name of the repository
     * @default 'repository'
     * @memberof! Clone#
     * @readonly
     */
    _dataRepository = 'repository'
    /**
     * @type {string}
     * @description Name of the log repository
     * @default 'log'
     * @memberof! Clone#
     * @readonly
     */
    _logRepository = 'log'
     /**
     * @type {string}
     * @description Name of the remote repository
     * @default 'origin'
     * @memberof! Push#
     */
     _remoteRepository = 'origin-';
    /**
     * @type {SocketHandler}
     * @description Name of the remote repository
     * @default null
     * @memberof! Push#
     */
    _socketHandler = null
     /**
     * @constructor
     * @param {string} dataRepository Name of the space where the repository will be saved
     * @param {string} logRepository Name of the space where the log will be saved
     * @description Create a new instance of Clone
     */
    constructor(dataRepository, logRepository, remoteRepository){
        this._dataRepository = dataRepository
        this._logRepository = logRepository
        this._remoteRepository = remoteRepository
        this._socketHandler = new SocketHandler(remoteRepository)
    }

    async execute(dataComand){
        let continueExecution = true;

        for(const config of await this.resolveConfiguration(dataComand)){
            continueExecution = await this._configurations[config].callback();
            if(!continueExecution)
                return;
        }

        if(!dataComand.includes(this._remoteRepository))
            return this._configurations.h.callback()


        sessionStorage.removeItem(this._dataRepository)
        let repository = await getRepository(this._remoteRepository)
        repository.information.repository = this._dataRepository
        repository.information.config = {
            user:{
                name:null,
                email:null
            }
        }
        if(repository.commits.length)
            repository = await this.defaultBranch(repository,this._remoteRepository.split("-")[0])

        sessionStorage.setItem(this._dataRepository,JSON.stringify(repository))
    }
    async defaultBranch(repository,refRemote,nameBranch="master"){
        repository.information.head = nameBranch
        repository.commits.forEach(async commit => {

            if(!commit.tags.length) return
            
            commit.tags.push(...(
                await Promise.all(commit.tags.map(async tag =>refRemote+"/"+tag))
            ))
            
            if(commit.tags.includes(nameBranch)){
                commit.tags.push("HEAD")
                commit.class.push("checked-out")
            }

        });
        return await repository
    }
    /**
     * @name resolveConfiguration
     * @method
     * @memberof! Clone#
     * @description Resolve the configuration of the command, extract the configuration of the command and validate it
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     * @example resolveConfiguration(['-m','"message"','-a']) // ['m','a']
     * @returns {Promise[String[]]} Array with the letters of the configuration
     */
    async resolveConfiguration(dataComand) {
        let configs = [] 
        dataComand.forEach(c => {
            if(c.startsWith("-")||c.startsWith("--"))
                configs.push(c.replace(/^(-{1,2})([a-zA-Z])/, "$2").charAt(0))//Remove the "-" or "--" of the configuration and select second group 
        });
        this.validateConfig(configs);
        configs = configs.filter((c,i,self) => self.indexOf(c) === i);
        return configs;
    }
    /**
     * @name validateConfig
     * @method
     * @memberof! Clone#
     * @description Validate the configuration of the command
     * @param {String[]} configs Array with the letters of the configuration
     * @example validateConfig(['h','all']) // true
     * @throws {Error} The configuration is empty
     * @throws {Error} The configuration "${config}" is not valid
     */
    async validateConfig(configs){
        const currentConfig = Object.keys(this._configurations);
        configs.forEach(config => {
            if(!currentConfig.includes(config))
                throw new Error(`The configuration "${config}" is not valid`);
        });
    }
    async callbackHelp(){
        createMessage(this._logRepository,'info', `
        <h5>Concept</h5>
        <p class="help"> Clone a repository into a new directory</p>
        <p class="help"> <b>URL:</b> Use "<b>${this._remoteRepository}</b>"</p>
        <h5>Syntax</h5>
        <p class="help">git clone &lt<b>URL</b>&gt</p>
        <p class="help">git clone [-h | --help]</p>
        <h5>Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">-h, --help&nbsp;&nbsp;&nbsp;Show the help</li>
        </ul>
        `)
        return false
    }
}
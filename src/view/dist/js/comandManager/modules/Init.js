import {createMessage} from './utils.js';
/**
 * @class
 * @classdesc This class is responsible for initializing a repository or reinitializing an existing one
 */
export class Init{
    _comand = 'init';
    /**
     * @typedef {Object} _configurationsOfInit
     * @property {Object<Boolean,Function>} q Quiet, only print error and warning messages; all other output will be suppressed.
     * @property {Boolean} q.quiet Indicate that the quiet option was used. Default is false
     * @property {Function} q.callback Callback to set the quiet option to true
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     * @alias _configurations
     * @readonly
     * @memberof! Init#
    */
    _configurations={
        h:{
            callback:()=>this.callbackHelp(),
        },
        q:{
            quiet:false,
            callback:()=>this._configurations.q.quiet=true,
        }
    };
    /**
     * @type {string}
     * @description Name of the repository
     * @default 'repository'
     * @memberof! Init#
     * @readonly
     */
    _repositoryName ='repository';
    /**
     * @type {string}
     * @description Name of the log repository
     * @default 'log'
     * @memberof! Init#
     * @readonly
     */
    _logRepository = 'log';
    /**
     * @constructor
     * @param {string} repositoryName Name of the space where the repository will be saved
     * @description Create a new instance of Init
     */
    constructor(repositoryName,logRepository){
        this._repositoryName = repositoryName;
        this._logRepository = logRepository
    }
    async execute(dataComand = ""){
        this.resetConfiguration;
        this.resolveConfiguration(dataComand);
        sessionStorage.setItem(this._repositoryName, JSON.stringify(
            {
                information:{
                    head:null,
                    repository:this._repositoryName,
                    config:{
                        user:{
                            name:null,
                            email:null
                        }
                    }
                    
                },
                commits:[]
            }    
        ));
    }
    /**
     * @name comand
     * @type {string}
     * @memberof! Init#
     * @description Get the name of the command
     * @default 'init'
     * @readonly
     */
    get comand(){return this._comand;}
    /**
     * @name resolveConfiguration
     * @method
     * @memberof! Init#
     * @description Resolve the configuration of the command, configuring the options that the user has entered
     * @param {String[]} config Data to contain the configuration of the command, it is an array of strings
     * @example resolveConfiguration(['-q'])
     * @example resolveConfiguration(['-h'])
     */
    async resolveConfiguration(config){
        if(config.length===0)
            return;
        const clearConfig = config.map(conf=>conf.replace(/^--?/,'').charAt(0));
        clearConfig.forEach(conf=>{
            if(conf in this._configurations)
                this._configurations[conf].callback();
            else
                throw new Error('Invalid option');
        });
    }
    /**
     * @name callbackHelp
     * @callback callbackHelp
     * @memberof! Init#
     * @description Show the help of the command in the console
     */
    callbackHelp=async ()=>{
        let message = `
        <h5>Concept</h5>
        <p class="help">Create an empty Git repository or reinitialize an existing one</p>
        <h5>Syntax</h5>
        <p class="help">git init [-q | --quiet] [-h | --help]</p>
        <h5>_Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">[-q | --quiet]&nbsp;&nbsp;&nbsp;Only print error and warning messages; all other output will be suppressed.</li>
            <li class="help">[-h | --help]&nbsp;&nbsp;&nbsp;Show the help</li>
        </ul>`;
        createMessage(this._logRepository,"info",message);
    }
    /**
     * @name resetConfiguration
     * @callback resetConfiguration
     * @memberof! Init#
     * @description Reset the configuration of the command
     */
    resetConfiguration = async ()=> {this.quiet = false};
}
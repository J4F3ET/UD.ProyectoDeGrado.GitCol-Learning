import { 
    currentHead,
    removeTags,
    createMessage,
    updateCommitToCommits, 
    removeClassFromCommit,
    createRegister,
    getRepository,
    newRegister
} from "./utils.js";
import { 
    ErrorModule,
    errorNotInitialized,
    errorNotConfiguration,
} from "./error.js";
/**
 * @class
 * @classdesc This class is responsible for creating a new commit in the repository. Represents the command "commit" of the git
 * @requires util
 * @example const commit = new Commit("local","log");
 */
export class Commit{
    _comand = 'commit';
    /**
     * @typedef {Object} _configurationsOfCommit  
     * @description Configurations who can be supported by the command, it is an object with the following properties
     * @property {Object<String,Function>} m Message of the commit. The property is the similitude with Git. [-m <message> | --message <message>]
     * @property {string} m.message Value of the message of the commit
     * @property {Function} m.callback Callback do resposability of assign the value of the message.
     * @property {Object<String[],Function>} a Files to be added to the commit. The property is the similitude with Git. [-a | --all] (NOT IMPLEMENTED) 
     * @property {String[]} a.files List of files to be added to the commit, by default is ["index.html","style.css","script.js"] 
     * @property {Function} a.callback Callback do responsability of generate a message in the console.
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     * @alias _configurations
     * @readonly
     * @memberof! Commit#
    */
    _configurations = {
        m:{
            message: "None",
            callback:async (dataComand)=> this.callBackConfigMessage(dataComand),
        },
        a:{
            files: ["index.html","style.css","script.js"],
            callback: async (dataComand)=> this.callBackConfigFiles(dataComand),
        },
        h:{
            callback:async (dataComand)=> this.callBackHelp(dataComand)
        }
    };
    /**
     * @member {string}
     * @description Name of space the local storage who contain the data referent to history of the commits(register but not commands)
     * @memberof! Commit# 
    */
    _dataRepository = 'repository';
    /**
     * @member {string}
     * @description Name of space the local storage who contain the history messages of application
     * @memberof! Commit#
     */
    _logRepository = 'log';
    /**
     *  The constructor of the class, it receives the repository of the data
     * @constructor
     * @param {string} dataRepository Name the space of the local storage who contain the data referent to history of the commits(register but not commands), by default is 'repository'
     * @param {string} logRepository Name the space of the local storage who contain the history messages of application, by default is 'log'
     */
    constructor(dataRepository,logRepository){
        this._dataRepository = dataRepository;
        this._logRepository = logRepository;
    }
    /** 
     * @name comand
     * @type {string}
     * @description Name of the command
     * @default commit
     * @memberof! Commit#
     * @readonly
    */
    get comand(){this._comand}
    /**
     * @name execute
     * @description Execute the command, responsible to create a new commit in the repository
     * @param {String[]} config Configuration of the command
     * @method 
     * @throws {Error} The repository does not exist
     * @example execute(['-m','"message"','-a'])
     * @example execute(['-m','"message"'])
     * @example execute(['-h'])
     * @memberof! Commit#
     */
    async execute(dataComand){
        //console.time('Execution time of commit');
        const storage =  await getRepository(this._dataRepository)

        if(!storage)
            throw errorNotInitialized(this._comand);

        if(!await this.resolveConfiguration(dataComand)) 
            return;

        if(!storage.commits.length){
            storage.information.head = "master";
            
            storage.commits.push(await newRegister(
                50,
                334,
                "init",
                this._configurations.m.message,
                ["master", "HEAD"],
                ["commit","checked-out"],
                storage.information.config.user.autor
            ));
            //console.timeEnd('Execution time of commit');
            return sessionStorage.setItem(this._dataRepository, JSON.stringify(storage));
        }
        let head = await currentHead(storage.commits);
        const response = await createRegister(
            storage.commits,
            head,
            storage.information,
            this._configurations.m.message
        );

        if(!storage.information.head.includes("deteached"))
            head = await removeTags(["HEAD",storage.information.head],head);
        else
            head = await removeTags(["HEAD"],head)

        head = await removeClassFromCommit(head,"checked-out");
        storage.commits = await updateCommitToCommits(response.commits,head);

        if(response.commit.class.includes("detached-head"))
            storage.information.head = "detached at " +response.commit.id 

        storage.commits.push(response.commit);
        sessionStorage.setItem(this._dataRepository, JSON.stringify(storage));
        //console.timeEnd('Execution time of commit');
    }
    /**
     * @name resolveConfiguration
     * @method
     * @memberof! Commit#
     * @description Resolve the configuration of the command, extract the configuration of the command and validate it
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     * @example resolveConfiguration(['-m','"message"','-a']) // ['m','a']
     * @returns {Promise<Boolean>} True if execute command, false do not execute commnad
     */
    async resolveConfiguration(dataComand) {
        let configs = new Set()
        let continueExecution = true
        dataComand.forEach(c => {
            if(c.startsWith("-")||c.startsWith("--"))
                configs.add(c.replace(/^(-{1,2})([a-zA-Z])/, "$2").charAt(0))//Remove the "-" or "--" of the configuration and select second group 
        });
        await this.validateConfig(configs);
        for (const config of configs) {
            if (!await this._configurations[config].callback(dataComand)) {
                continueExecution = false;
                break;
            }
        }

    return continueExecution;
    }
    /**
     * @name validateConfig
     * @method
     * @memberof! Commit#
     * @description Validate the configuration of the command
     * @param {Set<String>} configs Array with the letters of the configuration
     * @example validateConfig(['m','a']) // true
     * @throws {Error} The configuration is empty
     * @throws {Error} The configuration "${config}" is not valid
     */
    async validateConfig(configs){
        if(!configs.size)
            throw new ErrorModule(this._comand,'The configuration is empty',`Please, try again using the command 'git ${this._comand} -m "message"'`);
        const currentConfig = Object.keys(this._configurations);
        for(const config of configs){
            if(!currentConfig.includes(config))
                throw errorNotConfiguration(this._comand,config);
        }
    }
    /**
     * @name callBackConfigMessage
     * @callback callBackConfigMessage
     * @memberof! Commit#
     * @description Callback to the configuration of the message
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     * @throws {Error} The message is empty
     * @returns {Promise<Boolean>} True if the configuration is valid
     */
    callBackConfigMessage = async (dataComand) =>{
        const indexConfig = dataComand.findIndex(data => data.includes('-m'));
        const message = dataComand[indexConfig+1];
        if(message == undefined || message == "")
            throw new ErrorModule(this._comand,'The message is empty',`Please, try again using the command 'git ${this._comand} -m "message"'`);
        this._configurations.m.message = message.replace(/"/g, "&quot").replace(/'/g, "&apos");
        return true;
    }
    /**
     * @name callBackConfigFiles
     * @memberof! Commit#
     * @callback callBackConfigFiles
     * @description Callback to the configuration of the files
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     * @returns {Promise<Boolean>} True if the configuration is valid for continue the execution of the command
     * @example callBackConfigFiles(['-m','"message"','-a']) // true
     * @example callBackConfigFiles(['-a']) // false
     */
    callBackConfigFiles = async (dataComand) =>{
        if(!dataComand.includes('-m'))
            throw new ErrorModule(
                this._comand,
                'The configuration "-m" is obligatory for use the configuration "-a"',
                `Please, try again using the command 'git ${this._comand} -m "message" -a'`
            );

        const files = this._configurations.a.files.map(file => `<li>>${file}</li>`).join('');
        createMessage(this._logRepository,'info',`<div class="files"><h5>Add files to the commit</h5><ul>${files}</ul></div>`);
        
        return true;
    }
    /**
     * @name callBackHelp
     * @description Callback to the help of the command
     * @memberof! Commit#
     * @callback callBackHelp
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     * @returns {Promise<Boolean>} True if the configuration is valid for continue the execution of the command
     * @example callBackHelp(['-h']) // false
     * @example callBackHelp(['-m','"message"','-h']) // true
     */
    callBackHelp = async (dataComand) =>{
        createMessage(this._logRepository,'info',`
        <h5>Concept</h5>
        <p class="help">Record changes to the repository</p>
        <h5>Syntax</h5>
        <p class="help">git commit [-m &lt;message&gt;] [-a] [-h | --help]</p>
        <h5>Configurations</h5>
        <h6 class="help">Obligatory</h6>
        <ul>
            <li class="help">-m &lt;message&gt;&nbsp;&nbsp;&nbsp;Commit message</li>
        </ul>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">-a&nbsp;&nbsp;&nbsp;Add all files to the commit(files system no implemented)</li>
            <li class="help">-h, --help&nbsp;&nbsp;&nbsp;Show the help</li>
        </ul>`
        );
        return dataComand.includes('-m')?true:false;
    }

}
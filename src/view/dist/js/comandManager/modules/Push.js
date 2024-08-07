import { SocketHandler } from "../SocketHandler.js";
import { 
    createMessage,
    findAllTags,
    mergeChangesInBranchs,
    removeClassInRepository,
} from "./utils.js";
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
     * @description Create a new instance of Pull
     */
    constructor(dataRepository, logRepository, remoteRepository){
        this._dataRepository = dataRepository
        this._logRepository = logRepository
        this._remoteRepository = remoteRepository
        this._socketHandler = new SocketHandler(remoteRepository)
    }

    execute(dataComand){
        const remote = JSON.parse(sessionStorage.getItem(this._remoteRepository));
        const repository = JSON.parse(sessionStorage.getItem(this._dataRepository));
        if(!repository||!remote)
            throw new Error('The repository does not exist')
        const values = dataComand.filter(data => data.charAt(0) !== '-')
        const refRemote = values[0]||'origin'
        const refBranch = values[1]|| repository.information.head
        const branchsLocal = findAllTags(repository.commits)
        const branchsRemote = findAllTags(remote.commits)

        const findCommit = (commit) => commit.tags.includes(refBranch)

        let continueExecution = true;

        for(const config of this.resolveConfiguration(dataComand)){
            continueExecution = this._configurations[config].callback();
            if(!continueExecution)
                return;
        }
        if(values.length !== 0 && values.length !== 2)
            throw new Error('Repository and resfspec were not correctly specified.')
        
        if(refRemote != this._remoteRepository.split('-')[0])
            throw new Error(`Remote '<strong>${refRemote}</strong>' does not exist <br> By default the only existing connection at the moment is '<b>origin</b>'`)
        
        if(!branchsLocal.includes(refBranch))
            throw new Error(`Branch '<strong>${refBranch}</strong>' does not exist in local`)

        const commitsRemoteId = new Set(remote.commits.map((c)=> c.id))
        const commitsRepositoryId = new Set(repository.commits.map((c)=> c.id))
        const commiIdtLocal = repository.commits.find(findCommit)?.id
        const commitIdRemote = remote.commits.find(findCommit)?.id
        //Solo si la rama existe se efectura esta seccion de codigo
        if(branchsRemote.includes(refBranch)){
            if(!commitsRepositoryId.has(commitIdRemote))
                throw new Error(`
                    Failed to push some refs to ${this._remoteRepository} <br>
                    Updates were rejected because the remote contains work that you do 
                    not have locally. This is usually caused by another repository pushing 
                    to the same ref. You may want to first integrate the remote changes 
                    (e.g., 'git pull ...') before pushing again.
                `)
            if(commitsRemoteId.has(commiIdtLocal)){
                createMessage(
                    this._logRepository,
                    'info',
                    'Already up to date.'
                )
                return
            }
        }else if(commitsRemoteId.has(commiIdtLocal)){
            remote.commits.forEach(commit => {
                if(commit.id == commiIdtLocal){
                    commit.tags.push(refBranch)
                }
            })
            this._socketHandler.sendUpdateRepository(remote)
            return
        }
        remote.commits = removeClassInRepository(
            mergeChangesInBranchs(
                remote.commits,
                repository.commits,
                refBranch
            ),
            "checked-out"
        )
        this._socketHandler.sendUpdateRepository(remote)
    }
    /**
     * @name resolveConfiguration
     * @method
     * @memberof! Push#
     * @description Resolve the configuration of the command, extract the configuration of the command and validate it
     * @param {String[]} dataComand Data to contain the configuration of the command, it is an array of strings
     * @example resolveConfiguration(['-m','"message"','-a']) // ['m','a']
     * @returns {String[]} Array with the letters of the configuration
     */
    resolveConfiguration(dataComand) {
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
     * @memberof! Push#
     * @description Validate the configuration of the command
     * @param {String[]} configs Array with the letters of the configuration
     * @example validateConfig(['h','all']) // true
     * @throws {Error} The configuration is empty
     * @throws {Error} The configuration "${config}" is not valid
     */
    validateConfig(configs){
        const currentConfig = Object.keys(this._configurations);
        configs.forEach(config => {
            if(!currentConfig.includes(config))
                throw new Error(`The configuration "${config}" is not valid`);
        });
    }
    callbackHelp(){
        let message = `
        <h5>Concept</h5>
        <p class="help"> Update remote refs along with associated objects</p>
        <h5>Syntax</h5>
        <p class="help">git push [-h | --help] [&ltrepository&gt] [&ltrefspec&gt]</p>
        <h5>Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">-h, --help&nbsp;&nbsp;&nbsp;Show the help</li>
        </ul>`
        createMessage(this._logRepository,'info', message)
        return false;
    }
}
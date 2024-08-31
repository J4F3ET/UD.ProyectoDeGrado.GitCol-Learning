import { SocketHandler } from "../SocketHandler.js";
import { 
    createMessage,
    findAllTags,
    getRepository,
    mergeChangesInBranchs,
    removeClassInRepository,
    removeTags,
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

    async execute(dataComand){
        const remote = await getRepository(this._remoteRepository);
        const repository = await getRepository(this._dataRepository);

        if(!repository||!remote)
            throw new Error('The repository does not exist')

        const values = dataComand.filter(data => data.charAt(0) !== '-')

        const branchsLocal = await findAllTags(repository.commits)
        const branchsRemote = await findAllTags(remote.commits)
        const refRemote = values[0]||'origin'
        const refBranch = values[1]|| repository.information.head
        
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

        const commitsRemoteId = new Set(
            await Promise.all(remote.commits.map(async (c)=> c.id))
        )

        const commitsRepositoryId = new Set(
            await Promise.all(repository.commits.map(async (c)=> c.id))
        )

        const commiIdtLocal = repository.commits.find(findCommit)?.id
        const commitIdRemote = remote.commits.find(findCommit)?.id
        const existsBranchInRemote = branchsRemote.includes(refBranch)

        if(existsBranchInRemote && !commitsRepositoryId.has(commitIdRemote))
            throw new Error(`
                Failed to push some refs to ${this._remoteRepository} <br>
                Updates were rejected because the remote contains work that you do 
                not have locally. This is usually caused by another repository pushing 
                to the same ref. You may want to first integrate the remote changes 
                (e.g., 'git pull ...') before pushing again.
            `)

        if(existsBranchInRemote && commiIdtLocal == commitIdRemote)
            return createMessage(
                this._logRepository,
                'info',
                'Already up to date.'
            )

        if(existsBranchInRemote && commitsRemoteId.has(commiIdtLocal))
            return this._socketHandler.sendUpdateRepository(
                this.moveTag(
                    remote,
                    refBranch,
                    commitIdRemote,
                    commiIdtLocal
                ))
                
        if(!existsBranchInRemote && commitsRemoteId.has(commiIdtLocal)){
            remote.commits.forEach(commit => {
                if(commit.id == commiIdtLocal){
                    commit.tags.push(refBranch)
                }
            })
            return this._socketHandler.sendUpdateRepository(remote)
        }
        
        const response = await mergeChangesInBranchs(
            remote.commits,
            repository.commits,
            refBranch
        )
        
        remote.commits = removeClassInRepository(
            await this.removeTagsTheChanges(
                response.repository,
                response.changesId,
                refBranch,
                commiIdtLocal
            ),
            ["checked-out","detached-head"]
        )
        repository.commits = await this.updateTagRefInRepository(repository.commits,refBranch,refRemote);
        this._socketHandler.sendUpdateRepository(remote)
        sessionStorage.setItem(this._dataRepository,JSON.stringify(repository))
    }
    async updateTagRefInRepository(commits,refbranch,refRemote){
        return Promise.all(commits.map(async commit=>{

            if(!commit.tags.length)
                return commit
            
            const fullRefRemote = refRemote+"/"+refbranch
            const tags = new Set(commit.tags)

            if(tags.has(refbranch))
                commit.tags = [...commit.tags,fullRefRemote]

            if(tags.has(fullRefRemote))
                commit.tags = commit.tags.filter(t=> t!=fullRefRemote)

            return commit
        }))
    }
    async removeTagsTheChanges(commits,changesId,refBranch,idHeadCommitLocal){
        
        const tagsRemove = new Set(commits.flatMap(c =>{
            if(changesId.has(c.id))
                return c.tags||[]
        }))

        tagsRemove.delete(refBranch)
        changesId.delete(idHeadCommitLocal)

        return await Promise.all(commits.map(async commit=>{
            if(changesId.has(commit.id))
                commit.tags = commit.tags.filter(t =>!tagsRemove.has(t))

            if(commit.id == idHeadCommitLocal)
                commit.tags = commit.tags.filter(t => t == refBranch)
            else if(commit.tags.includes(refBranch))
                commit = await removeTags([refBranch],commit)

            return commit
        }))
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
        /**
     * @name moveTag
     * @description Move tag from idCommitOrigin to idCommitDestination
     * @memberof! Push#
     * @method
     * @param {Object} Repository Object represent repository and containd array of commits
     * @param {string} branch Name of branch(tag)
     * @param {string} idCommitOrigin id of commit (old commit)
     * @param {string} idCommitDestination id of commit (new commit)
     * @returns {Object} repository
     */
    moveTag(repository, branch, idCommitOrigin,idCommitDestination){
        repository.commits.forEach(async commit => {
            if(commit.id == idCommitDestination)
                commit.tags.push(branch)
            else if(commit.id == idCommitOrigin)
                commit = await removeTags([branch],commit)
        })
        return repository
    }
    /**
     * @name callBackHelp
     * @description Callback to the help of the command
     * @memberof! Push#
     * @callback callBackHelp
     */
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
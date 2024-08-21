import { 
    createMessage,
    findCommitsDiffBetweenRepositories,
    mergeChangesInRepositories,
    implementTagsRemotesInRepository,
    getRepository,
    resolveCreateMergeRegister,
    resolveMovilityTagInMerge,
    resolveIsHeadNull,
    getCommitStartPoint,
    findAllTags,
    findAllParents
} from "./utils.js";
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
     * @memberof! Pull#
    */
    _configurations = {
        h:{
            callback: async()=> this.callbackHelp()
        },
        q:{
            quiet:false,
            callback:async()=>this._configurations.q.quiet=true,
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
     * @default 'origin-'
     * @memberof! Pull#
     */
    _remoteRepository = 'origin-';
    /**
     * @constructor
     * @param {string} dataRepository Name of the space where the repository will be saved
     * @param {string} logRepository Name of the space where the log will be saved
     * @description Create a new instance of Pull
     */
    constructor(dataRepository, logRepository,remoteRepository){
        this._dataRepository = dataRepository
        this._logRepository = logRepository
        this._remoteRepository = remoteRepository
    }

    async execute(dataComand){
        console.time('Execution time of commit');
        const remoteRepository = await getRepository(this._remoteRepository)
        let localRepository = await getRepository(this._dataRepository)
        
        this.resetConfiguration()
        
        if(! remoteRepository|| ! localRepository)
            throw Error('The repository does not exist')

        if(!(await findCommitsDiffBetweenRepositories(localRepository.commits, remoteRepository.commits)).length)
           return createMessage(this._logRepository,'info','Already up to date.');
        //-----------GIT FETCH
        const refRemote = this._remoteRepository.split("-")[0]||"origin"
        localRepository.commits = await implementTagsRemotesInRepository(
            refRemote,
            ...Object.values(await mergeChangesInRepositories(
                localRepository.commits,
                remoteRepository.commits
            )
        ))

        if(!localRepository.information.head)
            localRepository = await resolveIsHeadNull(localRepository)
        //----------END GIT FETCH
        //=========GIT MERGE

        const tagsLocalRepository = new Set(await findAllTags(localRepository.commits)) 
        const refBranchLocalPull = dataComand[dataComand.length-1]??localRepository.information.head??""
        const refBranchRemotePull = refRemote+"/"+refBranchLocalPull 

        if(!tagsLocalRepository.has(refBranchLocalPull))
            throw Error(`fatal: couldn't find local ref "${refBranchLocalPull}"`)

        if(!tagsLocalRepository.has(refBranchRemotePull))
            throw Error(`fatal: couldn't find remote ref "${refBranchRemotePull}"`)

        const commitRemotePull = localRepository.commits.find(c => c.tags.includes(refBranchRemotePull))

        if(!commitRemotePull)
            throw Error('The commit does not exist');

        const commitLocalPull = localRepository.commits.find(c => c.tags.includes(refBranchLocalPull))

        const parentsCommitRemotePull = new Set(await Promise.all(
            (await findAllParents(localRepository.commits, commitRemotePull))
                .map(async commit=>commit.id)
        ));

        const parentscommitLocalPull = new Set(await Promise.all(
            (await findAllParents(localRepository.commits, commitLocalPull))
                .map(async commit=>commit.id)
        ));

        if(parentscommitLocalPull.has(commitRemotePull.id))
            return createMessage(this._logRepository,'info','Already up to date.');

        if(parentsCommitRemotePull.has(commitLocalPull.id))
            localRepository = await resolveMovilityTagInMerge(localRepository, commitRemotePull, commitLocalPull);
        else
            localRepository = await resolveCreateMergeRegister(localRepository, commitRemotePull, commitLocalPull);
        
        sessionStorage.setItem(this._dataRepository,JSON.stringify(localRepository))
        console.timeEnd('Execution time of commit');
    }
    /**
     * @memberof Pull#
     * @name resolveConfiguration
     * @method
     * @description Resolve the configurations of the merge
     * @param {string[]} dataComand
     */
    async resolveConfiguration(dataComand){
        if(dataComand.includes('-h'))
            this._configurations.h.callback();
        if(dataComand.includes('-q'))
            this._configurations.q.callback();
    }
    resetConfiguration= async()=>{
        this._configurations.q.quiet = false
    }
    /**
     * @name callBackHelp
     * @description Callback to the help of the command
     * @memberof! Pull#
     * @callback callBackHelp
     * @return {Promise<Boolean>}
     */
    callbackHelp= async ()=>{
        createMessage(this._logRepository,'info',`
            The pull command is used to fetch from and integrate with another repository or a local branch'
            'pull [options] [<repository> [<refspec>…​]]`)
        return false
    }
}
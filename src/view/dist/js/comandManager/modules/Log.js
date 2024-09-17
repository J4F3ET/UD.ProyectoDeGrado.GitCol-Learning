import { 
    createMessage,
    findAllParents,
    getCommitStartPoint,
    getRepository,
    removeClassFromCommit
} from "./utils.js";
import { 
    ErrorModule,
    errorNotInitialized,
    errorNotConfiguration,
    errorEmptyRepository
} from "./error.js";
/**
 * @class Log
 * @classdesc This class is responsible for showing the commit logs
 * @requires utils
 */
export class Log{
    _comand = 'log';
    /**
     * @typedef {Object} _configurationsOfLog
     * @memberof! Log#
     * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
     * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
     * @property {Object<Boolean,Number,Function>} n Number of commits to show
     * @property {Boolean} n.use Indicate that the number of commits to show was used. Default is false
     * @property {Number} n.value Number of commits to show
     * @property {Function} n.callback Callback to set the number of commits to show
     * @property {Object<Boolean,Function>} oneline This is configured to show the commit logs in one line 
     * @property {Boolean} oneline.use Indicate that the oneline option was used. Default is false
     * @property {Function} oneline.callback Callback to set the oneline option to true
     */
    _configurations={
        h:{
            callback:()=>this.callbackHelp(),
        },
        n:{
            use:false,
            value:null,
            callback:()=>{
                this._configurations.n.use=true
                return true
            }
        },
        oneline:{
            use:false,
            callback:()=>{
                this._configurations.oneline.use=true
                return true
            }
        }
    };
    /**
     * @type {string}
     * @description Name of the repository space in the local storage, where the repository is saved
     * @default 'repository'
     * @memberof! Log#
     * @readonly
     * @member
     */
    _repositoryName = 'repository';
    /**
     * @type {string}
     * @description Name of the log repository space in the local storage, where the logs are saved
     * @default 'log'
     * @memberof! Log#
     * @readonly
     * @member
     */
    _logRepository = 'log';
    /**
    * @constructor
    * @param {string} repositoryName Name of the repository space in the local storage, where the repository is saved. Default is 'repository'
    * @param {string} logRepository Name of the log repository space in the local storage, where the logs are saved. Default is 'log'
    * @description Create a new instance of Log
    * @memberof! Log#
    * @method
    */
    constructor(repositoryName,logRepository){
        this._repositoryName = repositoryName;
        this._logRepository = logRepository;
    }
    /**
     * @name comand
     * @description Get the name of the comand
     * @returns {string} Name of the comand
     * @memberof! Log#
     * @readonly
     * @default 'log'
     * @type {string}
     */
    get comand(){return this._comand}
    /**
     * @name execute
     * @description Execute the command
     * @param {string[]} dataComand Data of the command
     * @throws {Error} Repository not found
     * @throws {Error} Repository is empty
     * @memberof! Log#
     * @method
     */
    async execute(dataComand){
        let storage = await getRepository(this._repositoryName);
        
        this.resetConfig();

        if(!storage)
            throw errorNotInitialized(this._comand);

        if(!storage.commits.length)
            throw errorEmptyRepository(this._comand);

        setTimeout(()=>this.removeClassLog(),1000);

        if(!await this.resolveConfiguration(dataComand))
            return

        const startPoint = await getCommitStartPoint(dataComand,storage.commits);

        if(!startPoint)
            throw new ErrorModule(
                this._comand,
                `ambiguous argument '${dataComand.pop()}': unknown revision or path not in the working tree.`,
                `Please, try again using a valid start-point, 'master' or 'HEAD' or a valid branch name`
            );

        const listCommits = await this.resolveFiltersCommits(storage.commits,startPoint);
        const setListCommits = new Set(await Promise.all(listCommits.map(async commit => commit.id)))
        storage.commits = await Promise.all(storage.commits.map(async(commit)=>{
            if(setListCommits.has(commit.id))
                commit.class.push('logging');
            return commit
        }));

        if(this._configurations.oneline.use)
            this.generatorOnelineMessage(storage.information.head,listCommits);
        else
            this.generatorMessage(storage.information.head,listCommits);

        sessionStorage.setItem(this._repositoryName,JSON.stringify(storage));
    }
    /**
     * @name removeClassLog
     * @description Remove the class logging of the commits
     * @memberof! Log#
     * @callback removeClassLog
     */
    removeClassLog = async()=>{
        let storage = JSON.parse(sessionStorage.getItem(this._repositoryName));
        storage.commits = await Promise.all(storage.commits.map(async (commit)=>{
            return removeClassFromCommit(commit,'logging');
        }));
        sessionStorage.setItem(this._repositoryName,JSON.stringify(storage));
    }
    /**
     * @name resolveFiltersCommits
     * @description Resolve the filters that will be used in the commits
     * @param {JSON[]} commits List of commits
     * @param {JSON} commit Commit start point
     * @returns {Promise<JSON[]>} List of commits
     * @memberof! Log#
     * @method
     */
    async resolveFiltersCommits(commits,commit){
        let childs = [commit,...await findAllParents(commits,commit)];
        childs.sort((a,b)=>new Date(a.date)- new Date(b.date));
        if(this._configurations.n.use){
            if(this._configurations.n.value > childs.length)
                createMessage(this._logRepository,"error","The number of commits is greater than the number of commits the log has");
            else
                childs = childs.slice(0,this._configurations.n.value);
        }
        return childs;
    }
    /**
     * @name resolveConfiguration
     * @description Resolve the configurations of the command
     * @memberof! Log#
     * @method
     * @param {string[]} dataComand 
     */
    async resolveConfiguration(dataComand){
        let continueProces = true 
        dataComand.forEach((comand,index)=>{
            const clearComand = comand.replace(/^--?/,'');
            if(clearComand in this._configurations){
                continueProces = this._configurations[clearComand].callback();
                if(this._configurations[clearComand].hasOwnProperty('value'))
                    this._configurations[clearComand].value = dataComand[index+1];
            }else if(/^\d+$/.test(clearComand)){
                this._configurations.n.value = parseInt(clearComand);
                this._configurations.n.use = true;
            }else if(index != dataComand.length - 1)
                throw errorNotConfiguration(this._comand,clearComand);
        });
        return continueProces
    }
    /**
     * @name resetConfig
     * @description Reset all configurations
     * @memberof! Log#
     * @callback resetConfig
     */
    resetConfig= async ()=>{
        this._configurations.n.use = false;
        this._configurations.n.value = null;
        this._configurations.oneline.use = false;
        this._configurations.oneline.value = null;
    }
    /**
     * @name generatorMessage
     * @description Generate the message of the log command
     * @param {string} infoHead Status of the HEAD of the repository. Can be a branch name or a commit id with detached  
     * @param {JSON[]} commits List of commits
     * @memberof! Log#
     * @method
     */
    async generatorMessage(infoHead,commits){
        let message = '';
        new Set(commits).forEach(async(commit)=>{
            let tags = '';
            commit.tags.forEach(async(tag)=>{
                if(tag === 'HEAD'){
                    const head = infoHead.includes('detached')?infoHead.split(' ').pop():infoHead;
                    tags += `<b>HEAD</b>&nbsp;->&nbsp;${head},&nbsp`;
                }else if(tag !== infoHead)
                    tags += `${tag},&nbsp`;
            });
            message += `<p class="help underline">Commit:&nbsp;${commit.id}&nbsp;(${tags})</p>`;
            message += `<p class="help">Author:&nbsp;${commit.author?commit.author.name:undefined}&nbsp;&lt;${commit.author?commit.author.email:undefined}&gt;</p>`;
            message += `<p class="help">Date:&nbsp;&nbsp;&nbsp;${commit.date}</p>`;
            message += `<p class="help">${commit.message}</p>`;
        });
        createMessage(this._logRepository,"info",message);
    }
    /**
     * @name generatorOnelineMessage
     * @description Generate the message of the log command in one line
     * @param {string} infoHead Status of the HEAD of the repository. Can be a branch name or a commit id with detached
     * @param {JSON[]} commits List of commits
     * @memberof! Log#
     * @method
     */
    async generatorOnelineMessage(infoHead,commits){
        let message = ''; 
        new Set(commits).forEach((commit)=>{
            let tags = '';  
            commit.tags.forEach((tag)=>{
                if(tag === 'HEAD'){
                    const head = infoHead.includes('detached')?infoHead.split(' ').pop():infoHead;
                    tags += `<b>HEAD</b>&nbsp;->&nbsp;${head},&nbsp`;
                }else if(tag !== infoHead)
                    tags += `${tag},&nbsp`;
            });
            message += `<p class="help underline">Commit:&nbsp;${commit.id}&nbsp;(${tags})&nbsp;${commit.message}</p>`;
        });
        createMessage(this._logRepository,"info",message);
    }
    /**
     * @name callbackHelp
     * @description Callback to show the help
     * @memberof! Log#
     * @callback callbackHelp
     */
    callbackHelp= async()=>{
        let message = `
        <h5>Concept</h5>
        <p class="help">Show commit logs</p>
        <p class="help"><b>Start-point:</b> Can be a commit id or branch name</p>
        <h5>Syntax</h5>
        <p class="help">git log [-n &lt;number&gt;| -&lt;number&gt;] [start-point]</p>
        <p class="help">git log -h | --help</p>
        <h5>Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">-n &lt;number&gt;&nbsp;&nbsp;&nbsp;Limit the number of commits to show</li>
            <li class="help">[-h | --help]&nbsp;&nbsp;&nbsp;Show the help</li>
            <li class="help">[--oneline]&nbsp;&nbsp;&nbsp;This is a shorthand for "--pretty=oneline --abbrev-commit" used together.</li>
        </ul>`;
        createMessage(this._logRepository,"info",message);
        return false
    }
}
import { currentHead } from '../../util.js';
export class Checkout {
    /**
     * @name constructor
     * @description Constructor to the class
     * @param {string} dataRepository Reference to the repository
     * @param {string} logRepository Reference to the log repository
    */
    constructor(dataRepository = "repository",logRepository = "log") {
        this.comand = "checkout";
        this._dataRepository = dataRepository;
        this._logRepository = logRepository;
        this._configurations = {
            q:{
                useConfig: false,
            },
            b:{
                nameBranch: null,
                callback: this.callbackCreateBranch
            }
        };
    }
    execute(dataComand){
        if(localStorage.getItem(this._dataRepository)===null)
            throw new Error('The repository does not exist');
        this.resolveConfig(dataComand);
        if(this._configurations.b.nameBranch != null)
            this.createBranch(this._configurations.b.nameBranch);
        const commitCurrentHead = currentHead(JSON.parse(localStorage.getItem(this._dataRepository)).commits);
        const commitObjetive = this.findCommitByBranch(dataComand[0]);
        if(commitObjetive === undefined){
            this.updateHeadInformation("detached head");
            this.createMessageInfo(`Note: switching to 'detached HEAD'`);
            this.goToCommit(dataComand[0]);
            this.removeHeadTag(commitCurrentHead);
            console.log('EXECUTE DETACHED HEAD');
            return
        }
        this.createMessageInfo(`Switched to branch '${dataComand[0]}'`);
        this.goToCommit(commitObjetive.id);
        if(commitObjetive == commitCurrentHead.id)
            return
        this.removeHeadTag(commitCurrentHead);
        this.updateHeadInformation(dataComand[0]);
        console.log('EXECUTE NORMAL');
    }
    resolveConfig(dataComand){
        dataComand.includes('-q',)||dataComand.includes('--quiet')?this._configurations.q.useConfig = true:null;
        if(dataComand.includes('-b')||dataComand.includes('--branch')){
            if(dataComand[dataComand.indexOf('-b')+1]===undefined)
                throw new Error('The name of the branch is required');
            this._configurations.b.nameBranch = dataComand[dataComand.indexOf('-b')+1];
        }
    }
    updateHeadInformation(nameBranch){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.information.head = nameBranch;
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }

    removeHeadTag(head){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.filter(commit => commit.id !== head.id);
        head.tags = head.tags.filter(tag => tag !== 'HEAD');
        storage.commits.push(head);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    findCommitByBranch(nameBranch){
        console.log(nameBranch);
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        return storage.commits.find(commit => commit.tags.includes(nameBranch));
    }
    /**
     * @name goToCommit
     * @description Change the current head to the commit
     * @param {string} id Id of the commit
     * @throws {Error} The commit does not exist
     * @returns {void}
     */
    goToCommit(id){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        const commit = storage.commits.find(commit => commit.id === id);
        if(commit === undefined)
            throw new Error('The commit does not exist');
        commit.tags.push('HEAD');
        storage.commits = storage.commits.filter(commit => commit.id !== id);
        storage.commits.push(commit);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    /**
     * @name createBranch
     * @description Create a new branch in the repository 
     * @param {string} name Name of the new branch
     */
    createBranch(name){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        const head = currentHead(storage.commits);
        storage.commits = storage.commits.filter(commit => commit.id !== head.id);
        head.tags.push(name);
        storage.commits.push(head);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    createMessageInfo(message){
        if(this._configurations.q.useConfig)
            return
        const log = JSON.parse(localStorage.getItem(this._logRepository));
        log.push({tag: 'info',message: message});
        localStorage.setItem(this._logRepository,JSON.stringify(log));
    }
    callbackCreateBranch = () =>{
        console.log('Create branch',this._configurations.b.nameBranch,this._configurations.q.useConfig);

    }
}
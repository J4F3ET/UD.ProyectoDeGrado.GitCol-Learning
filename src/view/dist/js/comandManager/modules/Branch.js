import { currentHead } from "../../util.js";
export class Branch{
    /**
     * @name constructor
     * @description The constructor of the class, it receives the repository of the data
     * @param {string} dataRepository Name variable of the local storage of the repository, by default is 'repository'
     * @param {string} logRepository Name variable of the local storage of the log, by default is 'log'
     * @param {string} remoteRepository Name variable of the local storage of the remote repository, by default is null
     */
    constructor(dataRepository = "repository",logRepository = "log",remoteRepository = null) {
        this.comand = 'branch';
        this._configurations = {
            d:{
                callback: this.callBackConfigDelete,
            },
            r:{
                remote: this._remoteRepository !== null,
                callback: this.callBackConfigRemoteBranch,
            },
            a:{
                callback: this.callBackConfigAllBranch,
            },
            l:{
                callback: this.getLocalBranches,
            },
            m:{
                callback: this.callBackConfigRename,
            }
        };
        this._dataRepository = dataRepository;
        this._logRepository = logRepository;
        this._remoteRepository = remoteRepository;
    }
    execute(dataComand){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        if(!storage)
            throw new Error('The repository is not initialized');
        if(storage.commits.length === 0)
            throw new Error('There are no branch master');
        this.resolveConfig(dataComand);
    }
    resolveConfig(dataComand){ 
        console.log(this._dataRepository);
        this._configurations[dataComand[0].split('-')[1]].callback(dataComand[1],dataComand[2]);
    }
    getLocalBranches(){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        console.log(this._dataRepository);
        const branches = storage.commits.flatMap(commit => commit.tags.filter(tag => tag !== 'HEAD'));
        const headBranch = storage.information.head;
        branches.forEach(branch => {
            const message = branch !== headBranch ? branch : 'HEAD -> ' + headBranch;
            this.createMessageInfo(message);
        });
    }
    getRemoteBranches(){
        const storage = JSON.parse(localStorage.getItem(this._remoteRepository));
        const branches = storage.commits.flatMap(commit => commit.tags.filter(tag => tag !== 'HEAD'));
        branches.forEach(branch => this.createMessageInfo(branch));
    }
    createMessageInfo(message){
        const dataLog = JSON.parse(localStorage.getItem(this._logRepository)) || [];
        dataLog.push({tag: 'info',message});
        localStorage.setItem(this._logRepository,JSON.stringify(dataLog));
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
    /**
     * @name deleteBranch
     * @description Delete a branch in the repository
     * @param {string} name Name of the branch to delete
     */
    deleteBranch(name){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.map(commit => {
            if(commit.tags.includes(name))
                return {...commit,tags: commit.tags.filter(tag => tag !== name)}
            return commit;
        });
        head.tags = head.tags.filter(tag => tag !== name);
        storage.commits.push(head);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    /**
     * @name renameBranch
     * @description Rename a branch in the repository
     * @param {string} name Name of the branch to rename
     * @param {string} newName New name of the branch
     */
    renameBranch(name,newName){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.map(commit => {
            if(commit.tags.includes(name))
                return {...commit,tags: commit.tags.map(tag => tag === name ? newName : tag)}
            return commit;
        });
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    callBackConfigAllBranch = () => {
        this.getLocalBranches();
        if(this._remoteRepository)
            this.getRemoteBranches();
    }
    callBackConfigList = () => this.getLocalBranches();
    callBackConfigRemoteBranch = () => this.getRemoteBranches();
    callBackConfigDelete = (branch) => this.deleteBranch(branch);
    callBackConfigRename = (branch,newName) => this.renameBranch(branch,newName);
}
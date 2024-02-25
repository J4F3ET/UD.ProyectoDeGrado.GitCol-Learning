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
            c:{
                callback: this.callBackCreateBranch,
            },
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
                callback: this.callBackConfigList,
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
        const [comand,...value] = this.resolveConfig(dataComand);
        console.log(value);
        if(comand.callback)
            comand.callback(value);

    }
    resolveConfig(dataComand){
        if(dataComand.length === 0)
            return [this._configurations['l'],null];
        if(dataComand[0].substring(0,1) !== '-')
            return [this._configurations['c'],dataComand[0]];
        const comand = dataComand[0].replace(/-/g,'');
        return [this._configurations[comand],...dataComand.slice(1)];
    }
    getLocalBranches(){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
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
        if(storage.commits.some(commit => commit.tags.includes(name)))
            throw new Error('The branch already exists');
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
        const commitsParents = this.findCommitsParents();
        const commitObj = storage.commits.find(commit => commit.tags.includes(name));
        if(!commitObj)
            throw new Error('The branch does not exist');
        if(commitObj.tags.length>0){
            this.removeTagOfCommit(name,commitObj.id);
            return;
        }
        this.removeCommitsUntilSpecificPoints(commitObj,commitsParents);
    }
    removeTagOfCommit(name,id){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.map(commit => {
            if(commit.id === id && commit.tags.includes(name))
                return {...commit,tags: commit.tags.filter(tag => tag !== name)};
            return commit;
        });
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    findCommitsParents(){
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        const [init,nodeInit,...parents] = commits.map(commit => commit.parent);
        if(parents.length === 0)
            return [init,nodeInit];
        const repeatedParents = parents.filter((parent, index) => parents.indexOf(parent) !== index);
        return [init,nodeInit,...(repeatedParents.flat())];
    }
    findCommitById(id){
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        return commits.find(commitStorage => commitStorage.id === id);
    }
    findChildrens(id){
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        return commits.filter(commitStorage => commitStorage.parent === id);
    }
    removeCommitsUntilSpecificPoints(commitObj,pointsObjetive){
        if(pointsObjetive.includes(commitObj.id))
            return;
        if(commitObj.tags.includes())
            return;
        if(this.findChildrens(commitObj.id).length > 0)
            return;
        const parent = this.findCommitById(commitObj.parent);
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.filter(commit => commit.id !== commitObj.id);
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
        this.removeCommitsUntilSpecificPoints(parent,pointsObjetive);
    }
    /**
     * @name renameBranch
     * @description Rename a branch in the repository
     * @param {Array} branchs Array with the name of the branch and the new name
     */
    renameBranch([name,newName]){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.map(commit => {
            if(commit.tags.includes(name))
                return {...commit,tags: commit.tags.map(tag => tag === name ? newName : tag)}
            return commit;
        });
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    callBackConfigAllBranch = () => {
        this.callBackConfigList();
        this.callBackConfigRemoteBranch();
    }
    callBackConfigList = () => this.getLocalBranches();
    callBackConfigRemoteBranch = () => {
        if(!this._remoteRepository)
            throw new Error('The remote repository is not defined');
        this.getRemoteBranches()
    };
    callBackConfigDelete = (branch) => {
        if(branch === "")
            throw new Error('The name of the branch is empty');
        this.deleteBranch(branch);
    }
    callBackCreateBranch = (branch) => {
        if(branch === "")
            throw new Error('The name of the branch is empty');
        this.createBranch(branch)
    };
    callBackConfigRename = (...branchs) => this.renameBranch(...branchs);
    
}
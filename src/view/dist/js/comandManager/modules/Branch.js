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
    /**
     * @name execute
     * @description Execute the comand with the configurations
     * @param {Array} dataComand Array with the comand and the configurations
     */
    execute(dataComand){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        if(!storage)
            throw new Error('The repository is not initialized');
        if(storage.commits.length === 0)
            throw new Error('There are no branch master');
        const [comand,...value] = this.resolveConfig(dataComand);
        if(!comand)
            throw new Error('The comand is not valid');
        comand.callback(value);
    }
    /**
     * @name resolveConfig
     * @description Resolve the comand and return the configuration
     * @param {Array} dataComand Array with the comand and the configurations
     * @returns {Array} Array with the configuration and the value of the comand
     */
    resolveConfig(dataComand){
        if(dataComand.length === 0)
            return [this._configurations['l'],null];
        if(dataComand[0].substring(0,1) !== '-')
            return [this._configurations['c'],dataComand[0]];
        const comand = (dataComand[0].replace(/^--?/,'')).charAt(0);
        return [this._configurations[comand],...dataComand.slice(1)];
    }
    /**
     * @name getLocalBranches
     * @description Create messages with the local branches of the repository
     */
    getLocalBranches(){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        const branches = storage.commits.flatMap(commit => commit.tags.filter(tag => tag !== 'HEAD'));
        const headBranch = storage.information.head;
        branches.forEach(branch => {
            const message = branch !== headBranch 
                ? `<p>${branch}</p>`
                :`<p style="color:#49be25">*${headBranch}</p>`;
            this.createMessageInfo(message);
        });
    }
    /**
     * @name getRemoteBranches
     * @description Create messages with the remote branches of the repository
     */
    getRemoteBranches(){
        const storage = JSON.parse(localStorage.getItem(this._remoteRepository));
        const branches = storage.commits.flatMap(commit => commit.tags.filter(tag => tag !== 'HEAD'));
        branches.forEach(branch => this.createMessageInfo(branch));
    }
    /**
     * @name createMessageInfo
     * @description Create a message with the tag info
     * @param {string} message Message to create
     */
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
        storage.information.head = name;
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
    /**
     * @name removeTagOfCommit
     * @description Remove a tag of a commit
     * @param {string} name Name of the tag to remove
     * @param {string} id Id of the commit
     */
    removeTagOfCommit(name,id){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.commits = storage.commits.map(commit => {
            if(commit.id === id && commit.tags.includes(name))
                return {...commit,tags: commit.tags.filter(tag => tag !== name)};
            return commit;
        });
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
    }
    /**
     * @name findCommitsParents
     * @description Find the parents of the commits
     * @returns {Array} Array with the parents of the commits
     */
    findCommitsParents(){
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        const [init,nodeInit,...parents] = commits.map(commit => commit.parent);
        if(parents.length === 0)
            return [init,nodeInit];
        const repeatedParents = parents.filter((parent, index) => parents.indexOf(parent) !== index);
        return [init,nodeInit,...(repeatedParents.flat())];
    }
    /**
     * @name existBranch
     * @description Verify if the branch exist in the repository
     * @param {string} name Name of the branch
     * @returns {boolean} If the branch exist
    */
    existBranch(name){
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        return commits.some(commit => commit.tags.includes(name));
    }
    /**
     * @name findCommitById
     * @description Find a commit by the id
     * @param {string} id Id of the commit
     * @returns {Object} Object with the commit
     * @returns {undefined} If the commit does not exist
     */
    findCommitById(id){
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        return commits.find(commitStorage => commitStorage.id === id);
    }
    /**
     * @name findChildrens
     * @description Find the childrens of the commit
     * @param {string} id Id of the commit
     * @returns {Array} Array with the childrens of the commit
     * @returns {undefined} If the commit does not have childrens
     */
    findChildrens(id){
        const commits = JSON.parse(localStorage.getItem(this._dataRepository)).commits;
        return commits.filter(commitStorage => commitStorage.parent === id);
    }
    /**
     * @name removeCommitsUntilSpecificPoints
     * @description Remove the commits until a specific point
     * @param {Object} commitObj Object with the commit
     * @param {Array} pointsObjetive Array with the commits parents whit two or more childrens
     */
    removeCommitsUntilSpecificPoints(commitObj,pointsObjetive){
        if(pointsObjetive.includes(commitObj.id))
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
    /**
     * @name callBackConfigList
     * @description Call the method to create messages with the local branches of the repository and the remote branches
     */
    callBackConfigAllBranch = () => {
        this.callBackConfigList();
        this.callBackConfigRemoteBranch();
    }
    /**
     * @name callBackConfigList
     * @description Call the method to create messages with the local branches of the repository
     */
    callBackConfigList = () => this.getLocalBranches();
    /**
     * @name callBackConfigRemoteBranch
     * @description Call the method to create messages with the remote branches
     * @throws {Error} If the remote repository is not defined
     */
    callBackConfigRemoteBranch = () => {
        if(!this._remoteRepository)
            throw new Error('The remote repository is not defined');
        this.getRemoteBranches()
    };
    /**
     * @name callBackConfigDelete
     * @description Call the method to delete a branch
     * @param {string} branch Name of the branch to delete
     * @throws {Error} If the name of the branch is empty
     */
    callBackConfigDelete = (values) => {
        const branch = values[0];
        if(branch === "")
            throw new Error('The name of the branch is empty');
        if(branch === 'master' || branch === 'HEAD')
            throw new Error(`The branch can not be deleted ${branch}`);
        this.deleteBranch(branch);
    }
    /**
     * @name callBackCreateBranch
     * @description Call the method to create a branch
     * @param {string} branch Name of the branch to create
     * @throws {Error} If the name of the branch is empty
     */
    callBackCreateBranch = (values) => {
        const branch = values[0];
        if(branch === "")
            throw new Error('The name of the branch is empty');
        if(this.existBranch(branch))
            throw new Error('The branch already exist');
        this.createBranch(branch)
    };
    /**
     * @name callBackConfigRename
     * @description Call the method to rename a branch
     * @param {Array} branchs Array with the name of the branch and the new name
     * @throws {Error} If the command is not valid
     */
    callBackConfigRename = (branchs) => {
        if(branchs.length != 2 || branchs.some(branch => branch === ''))
            throw new Error('The command is not valid');
        this.renameBranch(branchs);
    }
}
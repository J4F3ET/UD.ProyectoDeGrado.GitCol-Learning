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
        let storage = JSON.parse(localStorage.getItem(this._dataRepository));
        if(!storage)
            throw new Error('The repository is not initialized');
        if(storage.commits.length === 0)
            throw new Error('There are no branch master');
        const [comand,...value] = this.resolveConfig(dataComand);
        if(!comand)
            throw new Error('The comand is not valid');
        storage = comand.callback(storage,value)??storage;
        localStorage.setItem(this._dataRepository,JSON.stringify(storage));
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
     * @param {JSON} storage Storage of the repository
     */
    getLocalBranches(storage){
        const headBranch = storage.information.head;
        const branches = storage.commits.flatMap(commit => commit.tags.filter(tag => tag !== 'HEAD'));
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
     * @param {JSON[]} commits Array with the commits of the repository
     * @param {string} name Name of the new branch
     * @returns {JSON[]} Array with the new commits of the repository  and the new branch
     */
    createBranch(commits,name){
        const head = currentHead(commits);
        commits = commits.filter(commit => commit.id !== head.id);
        head.tags.push(name);
        commits.push(head);
        if(head.class.includes("detached-head"))
            commits = this.changeDetachedCommitToCommit(head,commits)
        return commits
    }
    /**
     * @name changeDetachedCommitToCommit
     * @description Change the class of the commit detached to commit
     * @param {JSON} commit  Commit to change the class
     * @param {JSON[]} commits Array with the commits of the repository 
     * @returns {JSON[]} Array with the new commits of the repository
     */
    changeDetachedCommitToCommit(commit,commits){
        if(!commit.class.includes("detached-head"))
            return commits
        let parent;
        const newListCommits = commits.map(c=>{
            if(c.id == commit.id)
                c.class = c.class.filter(item=> item !="detached-head")
            if(c.id == commit.parent)
                parent = c
            return c
        })
        return this.changeDetachedCommitToCommit(parent,newListCommits);
    }
    /**
     * @name deleteBranch
     * @description Delete a branch in the repository
     * @param {JSON[]} commits Array with the commits of the repository
     * @param {string} name Name of the branch to delete
     * @returns {JSON[]} Array with the new commits of the repository
     */
    deleteBranch(commits,name){
        const commitObj = commits.find(commit => commit.tags.includes(name));
        if(!commitObj)
            throw new Error('The branch does not exist');
        if(commitObj.tags.includes('HEAD'))
            throw new Error('The branch is the HEAD');
        const childrens = this.findChildrens(commits,commitObj.id);
        if((childrens.some(commit => !commit.class.includes('detached-head')) && childrens.length > 0)||
        commitObj.tags.length > 1)
            return this.removeTagOfCommit(commits,name,commitObj.id);
        const idCommitsExceptionsDelete = this.findExceptionCommitsDelete(commits);
        return this.removeCommitsUntilSpecificPoints(
            this.removeTagOfCommit(commits,name,commitObj.id),
            commitObj,
            idCommitsExceptionsDelete
        );
    }
    /**
     * @name removeTagOfCommit
     * @description Remove a tag of a commit
     * @param {JSON[]} commits Array with the commits of the repository
     * @param {string} name Name of the tag to remove
     * @param {string} id Id of the commit
     * @returns {JSON[]} Array with the new commits of the repository
     */
    removeTagOfCommit(commits,name,id){
        return commits.map(commit => {
            if(commit.id === id && commit.tags.includes(name))
                commit.tags = commit.tags.filter(tag => tag !== name);
            return commit;
        });
    }
    /**
     * @name findCommitsParents
     * @description Find the parents of the commits
     * @param {JSON[]} commits Array with the commits of the repository
     * @returns {Array} Array with the ID parents of the commits
     */
    findExceptionCommitsDelete(commits){
        const parents = commits.map(commit => commit.parent&&!commit.class.includes('detached-head')?commit.parent:[]).flat();
        if(parents.length === 0)
            return commits.filter(commit => commit.id == 'parent'|| commit.id == 'init');
        const repeatedParents = parents.filter((parent, index) => parents.indexOf(parent) != index);
        const parentsWithTags = commits.filter(commit => commit.tags.length > 0 && parents.includes(commit.id)).map(commit => commit.id);
        return [...new Set([...repeatedParents,...parentsWithTags])];
    }
    /**
     * @name findChildrens
     * @description Find the childrens of the commit
     * @param {JSON[]} commits Array with the commits of the repository
     * @param {string} id Id of the commit
     * @param {JSON[]} childrens Array with the childrens of the commit
     */
    findChildrens(commits,id,childrens = []){
        const childrensFisrtGen = commits.filter(commitStorage => commitStorage.parent == id);
        if(childrensFisrtGen.length==0)
            return childrens;
        childrensFisrtGen.forEach(commit => {
            childrens.push(commit);
            this.findChildrens(commits,commit.id,childrens);
        });
        return childrens;
    }
    /**
     * @name removeCommitsUntilSpecificPoints
     * @description Remove the commits until a specific point
     * @param {JSON[]} commits Array with the commits of the repository
     * @param {JSON} commitObj Object with the commit
     * @param {String[]} pointsObjetive Array with the commits id parents whit two or more childrens
     * @returns {JSON[]} Array with the new commits of the repository
     */
    removeCommitsUntilSpecificPoints(commits,commitObj,pointsObjetive){
        if(pointsObjetive.includes(commitObj.id))
            return commits;
        const parent = commits.find(commit => commit.id === commitObj.parent);
        commits = commits.map(commit => {
            if(commit.id === commitObj.id)
                commitObj.class.push('detached-head');
            return commit;
        });
        return this.removeCommitsUntilSpecificPoints(commits,parent,pointsObjetive);
    }
    /**
     * @name renameBranch
     * @description Rename a branch in the repository
     * @param {JSON} storage Storage of the repository
     * @param {Array} branchs Array with the name of the branch and the new name
     * @returns {JSON} Storage of the repository with the new name of the branch
     */
    renameBranch(storage,[name,newName]){
        storage.commits = storage.commits.map(commit => {
            if(commit.tags.includes(name))
                commit.tags = commit.tags.map(tag => tag === name ? newName : tag)
            return commit;
        });
        if(storage.information.head === name)
            storage.information.head = newName;
        return storage;
    }
    /**
     * @name callBackConfigList
     * @description Call the method to create messages with the local branches of the repository and the remote branches
     * @param {JSON} storage Storage of the repository
     * @throws {Error} If the remote repository is not defined
     * @returns {void}
     */
    callBackConfigAllBranch = (storage) => {
        this.callBackConfigList(storage);
        this.callBackConfigRemoteBranch();
    }
    /**
     * @name callBackConfigList
     * @description Call the method to create messages with the local branches of the repository
     * @param {JSON} storage Storage of the repository
     * @returns {void}
     */
    callBackConfigList = (storage) => this.getLocalBranches(storage);
    /**
     * @name callBackConfigRemoteBranch
     * @description Call the method to create messages with the remote branches
     * @throws {Error} If the remote repository is not defined
     * @returns {void}
     */
    callBackConfigRemoteBranch = () => {
        if(!this._remoteRepository)
            throw new Error('The remote repository is not defined');
        this.getRemoteBranches()
    };
    /**
     * @name callBackConfigDelete
     * @description Call the method to delete a branch
     * @param {JSON} storage Storage of the repository
     * @param {String[]} values Name of the branch to delete
     * @throws {Error} If the name of the branch is empty
     * @throws {Error} If the branch can not be deleted
     * @returns {JSON} Storage of the repository with the branch deleted
     */
    callBackConfigDelete = (storage,values) => {
        const branch = values[0];
        if(branch === "")
            throw new Error('The name of the branch is empty');
        if(branch === 'master' || branch === 'HEAD' ||branch === storage.information.head)
            throw new Error(`The branch can not be deleted ${branch}`);
        storage.commits = this.deleteBranch(storage.commits,branch);
        return storage;
    }
    /**
     * @name callBackCreateBranch
     * @description Call the method to create a branch
     * @param {JSON} storage Storage of the repository
     * @param {String[]} values Name of the branch to create
     * @throws {Error} If the name of the branch is empty
     * @throws {Error} If the branch already exist
     * @returns {JSON} Storage of the repository with the new branch
     */
    callBackCreateBranch = (storage,values) => {
        const branch = values[0];
        if(branch === "")
            throw new Error('The name of the branch is empty');
        if(storage.commits.some(commit => commit.tags.includes(branch)))
            throw new Error('The branch already exist');
        storage.commits = this.createBranch(storage.commits,branch)
        storage.information.head = branch;
        return storage;
    };
    /**
     * @name callBackConfigRename
     * @description Call the method to rename a branch
     * @param {JSON} storage Storage of the repository
     * @param {String[]} branchs Array with the name of the branch and the new name
     * @throws {Error} If the command is not valid
     * @returns {JSON} Storage of the repository with the branch renamed
     */
    callBackConfigRename = (storage,branchs) => {
        if(branchs.length != 2 || branchs.some(branch => branch === ''))
            throw new Error('The command is not valid');
        return this.renameBranch(storage,branchs);
    }
}
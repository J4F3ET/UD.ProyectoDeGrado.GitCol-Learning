import { currentHead,isEmptyObject } from "../../util.js";
export class Commit {
    
    /**
     * @name constructor
     * @description The constructor of the class, it receives the repository of the data
     * @param {string} dataRepository Name variable of the local storage of the repository, by default is 'repository'
     */
    constructor(dataRepository = "repository") {
        this.comand = 'commit';
        this._configurations = ["m"];
        this._dataRepository = dataRepository;
    }
    resolveConfigure(config) {
        const configurations = config.split('-');
        console.log(configurations);
        
    }
    /**
     * @name execute
     * @description Execute the command
     * @param {String[]} config Configuration of the command
     * @returns {JSON} New commit created
     */
    execute(config) {
        if(localStorage.getItem(this._dataRepository)===null)
            throw new Error('The repository does not exist');
        if(isEmptyObject(config))
            throw new Error('The comand "commit" requires parameters');
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));// Array of commits
        if(storage.length == 0){
            this.addCommitToStorage({
                id: "parent",
                parent: "init",
                message: "First commit",
                tags: ["master", "HEAD"],
                cx: 140,
                cy: 360,
            });
            return
        }
        const head = currentHead(storage);
        const newCommit = this.createCommit(head,config);
        this.addCommitToStorage(newCommit);
        if(!this.existsCommitToStorage(newCommit)){
            throw new Error('Error in the command execution');
        }
    }
    /**
     * @name addCommitToStorage
     * @description Add a commit to the local storage
     * @param {object} commit Commit to be added to the local storage 
     */
    addCommitToStorage(commit){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        storage.push(commit);
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
    }
    /**
     * @name existsCommitToStorage
     * @description Check if a commit exists in the local storage
     * @param {object} commit Commit to be checked
     * @returns {boolean}
     */
    existsCommitToStorage(commit){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        return storage.array.some(c => c.id === commit.id);
    }
    /**
     * @name createCod
     * @description Create a random code of 7 characters
     * @returns {string} Returns a random code of 7 characters
     */
    createCod() {
        const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let codigo = '';
        for (let i = 0; i < 7; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            codigo += caracteres.charAt(indice);
        }
        return codigo;
    }
    /**
     * Create a new commit
     * @param {JSON} parent  Commit parent to create the new commit
     * @returns {JSON} New commit created
     */
    createCommit(parent,message) {
        return {
            id: this.createCod(),
            message,
            parent: parent.id,
            tags: parent.tags,
            cx : parseInt(parent.cx) + 80,
            cy : parseInt(parent.cy)
        };
    }
}
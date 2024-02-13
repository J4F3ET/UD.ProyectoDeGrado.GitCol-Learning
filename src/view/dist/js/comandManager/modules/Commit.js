import { currentHead } from "../../util.js";
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
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        const head = currentHead(storage);
        const newCommit = this.createCommit(head,config);
        this.addCommitToStorage(newCommit);
    }
    addCommitToStorage(commit){
        const storage = JSON.parse(localStorage.getItem(this._dataRepository));
        if(storage.array === undefined)
            storage.array = [];
        storage.array.push(commit);
        localStorage.setItem(this._dataRepository, JSON.stringify(storage));
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
    /*
    {
        "id": "84c98fe",
        "parent": "e137e9b",
        "tags": [
          "master"
        ],
        "cx": 140,
        "cy": 360,
        "branchless": false
      },
     */
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
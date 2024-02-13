export class Commit {

    /**
     * @name constructor
     * @description Create a new instance of the Commit class
     * @param {NameRepository} nameRepository Name of the repository to be used in the local storage
     */
    constructor(nameRepository) {
        this._repository = nameRepository;
        this.comand = 'commit';
    }
    execute(config) {
        
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
     * @name createCommit
     * @description Create commit in the repository and save it in the local storage
     * @param {String} message Commit message
     */
    createComit(message){
    }
    /**
     * @name addCommitToLocalStorage
     * @description Add commit to the local storage
     * @param {JSON} newCommit New commit to be added
     * @throws {Error} Repository not found
     * @throws {Error} Error adding commit to the repository
     */
    addCommitToLocalStorage(newCommit){
        if(localStorage.getItem(this._repository)===null)
            throw new Error('Repository not found');
        const repository = JSON.parse(localStorage.getItem(this._repository));
        repository.push(newCommit);
        localStorage.setItem('repository',JSON.stringify(repository));
    }
    /**
     * @name existsCommitToLocalStorage
     * @description Check if the commit exists in the local storage
     * @param {JSON} commit Commit to be checked
     * @returns {Boolean} Returns true if the commit exists in the local storage, otherwise returns false
     * @throws {Error} Repository not found
     */
    existsCommitToLocalStorage(commit){
        if(localStorage.getItem(this._repository)===null)
            throw new Error('Repository not found');
        const repository = JSON.parse(localStorage.getItem(this._repository));
        repository.find(_commit => _commit.id === commit.id);
        if(repository)
            return false;
        else
            return true;
    }
}
export class SocketHandler {
    /**
     * @name constructor
     * @description Create a new instance of SocketHandler
     * @param {String} remoteRepository The reference name of the local storage 
     * @returns {SocketHandler}
     */

    constructor(remoteRepository) {
        this._remoteRepository = remoteRepository;
        this.client = io();
        this.client.on('connect', () => {
            console.log('Connected to server');
        });
        this.client.on('disconnectToChannel', () => {
            console.log('Disconnected from server');
        });
        this.client.on('updateRepository', (data) => {
            console.log(data);
            //localStorage.setItem(remoteRepository, data);
        });
        
    }
    /**
     * @name updateRepositoryDatabase
     * @description Update the repository with the data from the server
     * @param {String} data 
     * @private
     */
    async sendUpdateRepositoryDatabase(data) {
        this.client.emit('updateRepository', data);
    }
    async sendUpdateRepositoryLocalStorage(data) {
        localStorage.setItem(this._remoteRepository, data);
    }
    /**
     * @name updateRepository
     * @description Update the repository with the data from the server
     * @param {String} data 
     */
    async sendUpdateRepository(data){
        //this.sendUpdateRepositoryLocalStorage(data);
        this.sendUpdateRepositoryDatabase(data);
    }
    async disconnect(){
        this.client.emit('disconnectToChannel');
    }
}

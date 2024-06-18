export class SocketHandler {
    /**
     * @name constructor
     * @description Create a new instance of SocketHandler
     * @param {String} remoteRepository The reference name of the local storage 
     * @returns {SocketHandler}
     */
    constructor(remoteRepository) {
        this.remoteRepository = remoteRepository;
        this.socket = io();
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
    }
    /**
     * @name send
     * @description Send a message to the server
     * @param {String} message 
     */
    send(message) {
        this.socket.emit('message', message);
    }
    /**
     * @name updateRepositoryDatabase
     * @description Update the repository with the data from the server
     * @param {String} data 
     * @private
     */
    async updateRepositoryDatabase(data) {
        this.socket.emit('updateRepository', data);
    }
    async updateRepositoryLocalStorage(data) {
        localStorage.setItem(this.remoteRepository, data);
    }
    /**
     * @name updateRepository
     * @description Update the repository with the data from the server
     * @param {String} data
     */
    updateRepository(data){
        this.updateRepositoryDatabase(data);
        this.updateRepositoryLocalStorage(data);
    }
}

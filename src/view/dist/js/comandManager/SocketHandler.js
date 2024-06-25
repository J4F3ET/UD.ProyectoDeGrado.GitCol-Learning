export class SocketHandler {
    /**
     * @name constructor
     * @description Create a new instance of SocketHandler
     * @param {String} remoteRepository The reference name of the local storage 
     * @returns {SocketHandler}
     */

    constructor(remoteRepository,observer) {
        this._remoteRepository = remoteRepository;
        this.client = io();
        this.observer = observer;
        this.client.on('updateRepository', (data) => {
            this.updateCommitsToRepository(data);
        });
        this.client.on('error', (error) => {         
            //LOGIC TO HANDLE ERROR
        });
    }
    async updateCommitsToRepository(data){
        const localStorageCurrent =  JSON.parse(localStorage.getItem(this._remoteRepository));
        localStorageCurrent.commits = data;
        localStorage.setItem(this._remoteRepository,JSON.stringify(localStorageCurrent));
        this.observer.notify(localStorage.getItem(this._remoteRepository));
    }
    /**
     * @name updateRepository
     * @description Update the repository with the data from the server
     * @param {JSON} data The data to update the repository
     */
    async sendUpdateRepository(data){
        if('commits' in data)
            this.client.emit('updateRepository', data.commits);
    }
    async disconnect(){
        this.client.emit('disconnectToChannel');
    }
}

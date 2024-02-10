export class ComandManager {
    constructor() {
        this.comands = new Map();
    }
    /**
     * Add a command to the command manager
     * @param {String} comand
     * @param {Object} module
     */
    addComand(comand,module) {
        this.comands.set(comand,module);
    }
    /**
     * Remove a command from the command manager
     * @param {String} comand
     */
    removeComand(comand) {
        this.comands.delete(comand);
    }
    /**
     * Get all the commands
     * @returns {Array<String>}
     */
    getComands() {
        return Array.from(this.comands.keys());
    }
    /**
     * Execute a command
     * @param {String} command 
     * @param {String} config
     * @returns {Promise<Boolean>}
     * @throws {Error} Comand not found
     * @throws {Error} Error in the command execution
     */
    executeCommand(command, config){
        if (this.comands.has(command)) {
            const commandModule = this.comands.get(command);
            return commandModule.execute(config);
        } else {
            throw new Error('Command not found');
        }
    }
    /** 
     * Create a message and save it in the local storage
     * @name createMessage
     * @param {String} tag Tag of the message
     * @param {String} message Message to be saved
     */
    createMessage(tag,message){
        if(localStorage.getItem('log')===null)
            localStorage.setItem('log',JSON.stringify([]));
        const log = JSON.parse(localStorage.getItem('log'));
        log.push({tag,message});
        localStorage.setItem('log',JSON.stringify(log));
    }
}
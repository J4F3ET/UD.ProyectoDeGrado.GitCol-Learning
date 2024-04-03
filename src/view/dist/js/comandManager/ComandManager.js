/**
 * @name ComandManager
 * @description Class to manage the commands
 * @param {Map<String,Object>} comands
 * @param {Object} shellCommands
 * @returns {ComandManager}
 * @throws {Error} The command is empty
 * @throws {Error} The command is not valid
 * @throws {Error} Command not found
 */
export class ComandManager {
    constructor() {
        this.comands = new Map();
        this.shellCommands={
            'clear':()=>localStorage.setItem('log',JSON.stringify([])),
            'help': ()=>this.callBackHelp()
        };
    }
    /**
     * Add a command to the command manager
     * @param {String} comand
     * @param {Object} module
     */
    addComand(comand,module){
        this.comands.set(comand,module);
    }
    /**
     * @name callBackHelp
     * @description Generate a help message with all the commands
     * @returns {void}
     */
    callBackHelp(){
        let message = `<h5 class="help">Commands shell</h5>`
        Object.keys(this.shellCommands).forEach(key=>message+=`<p class="help">>${key}</p>`);
        message += `<h5 class="help">Commands git</h5>`
        this.comands.keys().forEach(key=>message+=`<p class="help">>git ${key}</p>`);
        message += `<p class="help">More information using 'git &lt;comand&gt; [-h|--help]'</p>`
        this.createMessage("info",message); 
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
     * @param {String[]} config
     * @returns {Promise<Boolean>}
     * @throws {Error} Comand not found
     * @throws {Error} Error in the command execution
     */
    executeCommand(sentence,command, config){
        if (this.comands.has(command)) {
            this.verifyComand(sentence);
            const commandModule = this.comands.get(command);
            return commandModule.execute(config);
        }
        if(this.shellCommands[sentence]){
            this.shellCommands[sentence]();
            return
        }
        throw new Error('Command not found');
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
    /**
     * @name verifyComand
     * @description Verify if the comand is valid syntax
     * @param {String} comand 
     * @throws {Error} The command is empty
     * @throws {Error} The command is not valid
     */
    verifyComand(comand="") {
        if(comand === "")
            throw new Error('The command is empty');
        const refex = /^(git) [a-z]* *(?: .*)?$/
        if(!refex.test(comand))
            throw new Error('The command is not valid');
    }
}
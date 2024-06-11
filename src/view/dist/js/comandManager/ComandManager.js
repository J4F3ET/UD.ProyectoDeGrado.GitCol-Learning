/**
 * @class
 * @classdesc Class to manage the commands
 */
export class ComandManager {
    /**
     * @memberof ComandManager#
     * @name _comands
     * @member
     * @description Map of the commands
     * @type {Map<String,Object>}
    */
    _comands = new Map();
    /**
     * @memberof ComandManager#
     * @name _shellCommands
     * @member
     * @description Map of the shell commands
     * @type {Object<String,Function>}
     * @property {Function} clear Clear the log
     * @property {Function} help Show the help message
     */
    _shellCommands = {
        'clear':()=>localStorage.setItem('log',JSON.stringify([])),
        'help': ()=>this.callBackHelp()
    };
    /**
     * @constructor
     * @description Create a new instance of the ComandManager
     */
    constructor(){}
    /**
     * @memberof ComandManager#
     * @method
     * @name addComand
     * @description Add a command to the command manager
     * @param {String} comand
     * @param {Object} module
     */
    addComand(comand,module){
        this._comands.set(comand,module);
    }
    /**
     * @memberof ComandManager#
     * @name callBackHelp
     * @callback callBackHelp
     * @description Generate a help message with all the commands
     * @returns {void}
     */
    callBackHelp(){
        let message = `<h5 class="help">Commands shell</h5>`
        Object.keys(this._shellCommands).forEach(key=>message+=`<p class="help">>${key}</p>`);
        message += `<h5 class="help">Commands git</h5>`
        this._comands.keys().forEach(key=>message+=`<p class="help">>git ${key}</p>`);
        message += `<p class="help">More information using 'git &lt;comand&gt; [-h|--help]'</p>`
        this.createMessage("info",message); 
    }
    /**
     * @memberof ComandManager#
     * @method
     * @name removeComand
     * @description Remove a command from the command manager
     * @param {String} comand key of the command to be removed
     */
    removeComand(comand) {
        this._comands.delete(comand);
    }
    /**
     * @memberof ComandManager#
     * @method
     * @name getComands
     * @description Get all the commands
     * @returns {Array<String>}
     */
    getComands() {
        return Array.from(this._comands.keys());
    }
    /**
     * @description Execute a command
     * @name executeCommand
     * @memberof ComandManager#
     * @method
     * @param {String} sentence Key of the command, it is the command to be executed without the 'git' word
     * @throws {Error} Comand not found
     * @throws {Error} Error in the command execution
     */
    executeCommand(sentence){
        if(this._shellCommands[sentence]){
            this._shellCommands[sentence]();
            return
        }
        this.verifyComand(sentence);
        const [command,...config] = this.splitComand(sentence);
        if (this._comands.has(command)) {
            const commandModule = this._comands.get(command);
            return commandModule.execute(config);
        }
        throw new Error('Command not found');
    }
    /** 
     * @memberof ComandManager#
     * @method
     * @description Create a message and save it in the local storage
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
     * @memberof ComandManager#
     * @method
     * @description Verify if the comand is valid syntax
     * @param {String} comand 
     * @throws {Error} The command is empty
     * @throws {Error} The command is not valid
     */
    verifyComand(comand="") {
        if(comand === "")
            throw new Error('The command is empty');
        const refex = /^\s*git\s+(\S+)+(\s(.*))?$/;
        if(!refex.test(comand))
            throw new Error('The command is not valid');
    }
    /**
     * @name splitComand
     * @memberof ComandManager#
     * @method
     * @description Split the comand in the command and the config
     * @param {String} comand 
     * @returns {Array<String>} Array with the command and the config
     */
    splitComand(comand){
        const regexSplit = /^\s*git\s+(\S+)\s*(.*)$/;
        const [_,gitComand,comandConfig] = comand.match(regexSplit);
        return [gitComand,...this.normalizeConfigComand(comandConfig)];
    }
    /**
     * @name normalizeConfigComand
     * @memberof ComandManager#
     * @method
     * @description Normalize the config of the command
     * @param {String} comandConfig 
     * @returns {Array<String>} Array with the config of the command
     */
    normalizeConfigComand(comandConfig){
        const regex = /(".*?"|'.*?'|\S+)/g;
        const matches = comandConfig.match(regex);
        return matches?matches.map(match => match.trim()):[];
    }

}
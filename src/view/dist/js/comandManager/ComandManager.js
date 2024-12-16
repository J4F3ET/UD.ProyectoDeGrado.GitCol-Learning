/**
 * @class
 * @classdesc Class to manage the commands
 */
export class ComandManager {
	/**
	 * @memberof ComandManager#
	 * @name _ref_storage_log
	 * @member
	 * @description Reference to the storage log
	 * @type {String}
	 * @default "log"
	 * @private
	 */
	_ref_storage_log = "log";

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
		clear: () =>
			sessionStorage.setItem(this._ref_storage_log, JSON.stringify([])),
		help: () => this.callBackHelp(),
	};
	/**
	 * @constructor
	 * @description Create a new instance of the ComandManager
	 */
	constructor(ref_sotrage_log) {
		this._ref_storage_log = ref_sotrage_log;
	}
	/**
	 * @memberof ComandManager#
	 * @method
	 * @name addComand
	 * @description Add a command to the command manager
	 * @param {String} comand
	 * @param {Object} module
	 */
	addComand(comand, module) {
		this._comands.set(comand, module);
	}
	/**
	 * @memberof ComandManager#
	 * @name callBackHelp
	 * @callback callBackHelp
	 * @description Generate a help message with all the commands
	 * @returns {void}
	 */
	callBackHelp() {
		let message = `<h5 class="help">Commands shell</h5>`;
		Object.keys(this._shellCommands).forEach(
			(key) => (message += `<p class="help">>${key}</p>`)
		);
		message += `<h5 class="help">Commands git</h5>`;
		this._comands
			.keys()
			.forEach((key) => (message += `<p class="help">>git ${key}</p>`));
		message += `<p class="help">More information using 'git &lt;comand&gt; [-h|--help]'</p>`;
		this.createMessage("info", message);
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
	executeCommand(sentence) {
		if (this._shellCommands[sentence]) {
			this._shellCommands[sentence]();
			return;
		}
		this.verifyComand(sentence);
		const [command, ...config] = this.splitComand(sentence);
		if (this._comands.has(command)) {
			const commandModule = this._comands.get(command);
			return commandModule.execute(config);
		}
		throw this.getErrorFormat(
			"syntax",
			`Command '${command}' not found`,
			`Try use the command 'help' by see the commands to which you can use, and use 'git &ltcommand&gt -h' for more information about the command`
		);
	}
	/**
	 * @memberof ComandManager#
	 * @method
	 * @description Create a message and save it in the local storage
	 * @name createMessage
	 * @param {String} tag Tag of the message
	 * @param {String} message Message to be saved
	 */
	createMessage(tag, message) {
		if (sessionStorage.getItem(this._ref_storage_log) == null)
			sessionStorage.setItem(this._ref_storage_log, JSON.stringify([]));
		const log = JSON.parse(sessionStorage.getItem(this._ref_storage_log));
		log.push({tag, message});
		sessionStorage.setItem(this._ref_storage_log, JSON.stringify(log));
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
	verifyComand(comand = "") {
		if (comand === "")
			throw this.getErrorFormat(
				"empty",
				"The command is empty",
				`Try use the command 'help' by see the commands to which you can use, example 'git init'`
			);
		const refex = /^\s*git\s+(\S+)+(\s(.*))?$/;
		if (!refex.test(comand))
			throw this.getErrorFormat(
				"syntax",
				"The command is not valid",
				`Try use the command 'help' by see the commands to which you can use and verify the syntax of the command`
			);
	}
	/**
	 * @name splitComand
	 * @memberof ComandManager#
	 * @method
	 * @description Split the comand in the command and the config
	 * @param {String} comand
	 * @returns {Array<String>} Array with the command and the config
	 */
	splitComand(comand) {
		const regexSplit = /^\s*git\s+(\S+)\s*(.*)$/;
		const [_, gitComand, comandConfig] = comand.match(regexSplit);
		return [gitComand, ...this.normalizeConfigComand(comandConfig)];
	}
	/**
	 * @name normalizeConfigComand
	 * @memberof ComandManager#
	 * @method
	 * @description Normalize the config of the command
	 * @param {String} comandConfig
	 * @returns {Array<String>} Array with the config of the command
	 */
	normalizeConfigComand(comandConfig) {
		const regex = /(".*?"|'.*?'|\S+)/g;
		const matches = comandConfig.match(regex);
		return matches ? matches.map((match) => match.trim()) : [];
	}
	/**
	 * @method
	 * @memberof ComandManager#
	 * @description
	 * @param {String} name Name of the error
	 * @param {String} message Message of the error
	 * @param {String} suggestion Suggestion of the error
	 * @returns {Error}
	 */
	getErrorFormat(name, message, suggestion) {
		const messageError = `
            > <strong>Error ${name}</strong><br>
            > <strong>Message</strong>: ${message}<br>
            > <strong>Suggestion</strong>: ${suggestion ?? ""}
        `;
		return new Error(messageError);
	}
}

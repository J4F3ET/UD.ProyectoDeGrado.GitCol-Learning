export class ErrorModule extends Error{
    /**
     * @constructor
     * @param {string} module
     * @param {string} message
     * @param {string} suggestion
     * @memberof ErrorModule
     */
    constructor(module,message,suggestion = null){
        super(message);
        this._name = "Error";
        this._module = module;
        this._suggestion = suggestion;
        this.message = `
            > <strong>${this._name} Module</strong>: ${this._module}<br>
            > <strong>Message</strong>: ${message}<br>
            > <strong>Suggestion</strong>: ${this._suggestion??''}
        `
        
    }
    /**
     * @name message
     * @type {string}
     * @description Message of the error
     * @readonly
     * @memberof ErrorModule
     */
    get message(){return this.message}
}
/**
 * @name errorNotInitialized
 * @description Create a new error for the command not initialized
 * @param {String} module Name of the module
 * @returns {ErrorModule}
 */
export const errorNotInitialized = (module)=>{
    return new ErrorModule(
        module,
        'The repository is not initialized',
        `The repository is not initialized, please execute the command 'git init'`
    );
}
/**
 * @name errorNotConfiguration
 * @description Create a new error for the command configuration not valid
 * @param {String} module Name of the module
 * @param {String} command Data of the command
 * @returns {ErrorModule}
 */
export const errorNotConfiguration = (module,command)=>{
    return new ErrorModule(
        module,
        `The configuration "${command}" is not valid`,
        `Try use the command 'git ${module} -h' for more information`
    );
}

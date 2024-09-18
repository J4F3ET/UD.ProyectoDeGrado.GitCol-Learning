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
        `The parameter ${command} is not valid or value is not set`,
        `Try use the command 'git ${module} -h' for more information`
    );
}
/**
 * @name errorCommitNotFound
 * @description Create a new error for the command not found commit
 * @param {String} module Name of the module
 * @param {String} commitId Id of the commit
 * @returns {ErrorModule}
 */
export const errorCommitNotFound = (module,startPoint)=>{ 
    return new ErrorModule(
        module,
        `The commit ${startPoint??null} does not exist`,
        `Try use the command 'git ${module} -h' for more information or use the command 'git commit -m "message"'`
    );
}
/**
 * @name errorAlreadyUpToDate
 * @description Create a new error for the command already up to date
 * @param {String} module Name of the module
 * @returns {ErrorModule}
 */
export const errorAlreadyUpToDate = (module)=>{ 
    return new ErrorModule(
        module,
        `Already up to date.`,
        `The information of the repository is already up to date. Try use the command 'git ${module} -h' for more information `
    );
}
/**
 * @name errorEmptyRepository
 * @description Create a new error for the command empty repository
 * @param {String} module Name of the module
 * @returns {ErrorModule}
 */
export const errorEmptyRepository = (module)=>{ 
    return new ErrorModule(
        module,
        `The repository is empty`,
        `Please, try again using 'git commit -m "message"'`
    );
}
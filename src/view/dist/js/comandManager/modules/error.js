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
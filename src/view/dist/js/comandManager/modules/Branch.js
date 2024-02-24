export class Branch{
    /**
     * @name constructor
     * @description The constructor of the class, it receives the repository of the data
     * @param {string} dataRepository Name variable of the local storage of the repository, by default is 'repository'
     */
    constructor(dataRepository = "repository",logRepository = "log") {
        this.comand = 'branch';
        this._configurations = {
            d:{
                delete: false,
                callback: this.callBackConfigDelete,
            },
            r:{
                remote: false,
                callback: this.callBackConfigRename,
            },
            a:{
                all: false,
                callback: this.callBackConfigAll,
            },
            l:{
                local: false,
                callback: this.callBackConfigList,
            }
        };
        this._dataRepository = dataRepository;
        this._logRepository = logRepository;
    }
    execute(dataComand){
        
    }
}
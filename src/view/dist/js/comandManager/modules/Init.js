export class Init{
    constructor(repositoryName){
        this.comand = 'init';
        this._repositoryName = repositoryName;
    }
    execute(config = ""){
        if(config != "")
            throw new Error('The comand "init" does not require parameters');
        if(localStorage.getItem('repository')!==null)
            throw new Error('The repository already exists');
        localStorage.setItem(this._repositoryName, JSON.stringify(
            {
                information:{
                    head:"",
                    repository:this._repositoryName
                },
                commits:[]
            }    
        ));
    }
}
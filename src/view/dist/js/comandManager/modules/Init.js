export class Init{
    constructor(){
        this.comand = 'init';
    }
    execute(config = ""){
        if(config != "")
            throw new Error('The comand "init" does not require parameters');
        if(localStorage.getItem('repository')!==null)
            throw new Error('The repository already exists');
        localStorage.setItem('repository', JSON.stringify([]));
    }
}
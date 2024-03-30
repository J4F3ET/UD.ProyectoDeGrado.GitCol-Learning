export class Init{
    constructor(repositoryName = 'repository'){
        this.comand = 'init';
        this.configurations={
            h:{
                callback:this.callbackHelp,
            },
            q:{
                quiet:false,
                callback:()=>this.configurations.q.quiet=true,
            }
        };
        this._repositoryName = repositoryName;
    }
    execute(config = ""){
        this.resetConfig;
        this.resolveConfig(config);
        localStorage.setItem(this._repositoryName, JSON.stringify(
            {
                information:{
                    head:"",
                    repository:this._repositoryName,
                    config:{
                        user:{
                            name:null,
                            email:null
                        }
                    }
                    
                },
                commits:[]
            }    
        ));
    }
    resolveConfig(config){
        if(config.length===0)
            return;
        const clearConfig = config.map(conf=>conf.replace(/^--?/,'').charAt(0));
        clearConfig.forEach(conf=>{
            if(conf in this.configurations)
                this.configurations[conf].callback();
            else
                throw new Error('Invalid option');
        });
    }
    createMessageInfo(message){
        if(localStorage.getItem('log')===null)
            localStorage.setItem('log',JSON.stringify([]));
        if(this.configurations.q.quiet)return;
        const log = JSON.parse(localStorage.getItem('log'));
        log.push({tag:'info',message});
        localStorage.setItem('log',JSON.stringify(log));
    }
    callbackHelp=()=>{
        let message = `
        <h5>Concept</h5>
        <p class="help">Create an empty Git repository or reinitialize an existing one</p>
        <h5>Syntax</h5>
        <p class="help">git init [-q | --quiet] [-h | --help]</p>
        <h5>Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">[-q | --quiet]&nbsp;&nbsp;&nbsp;Only print error and warning messages; all other output will be suppressed.</li>
            <li class="help">[-h | --help]&nbsp;&nbsp;&nbsp;Show the help</li>
        </ul>`;
        this.createMessageInfo(message);
    }
    resetConfig = ()=>this.quiet = false;
}
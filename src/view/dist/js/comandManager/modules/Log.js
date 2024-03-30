export class Log{
    constructor(repositoryName = 'repository',logRepository = 'log'){
        this.comand = 'log';
        this.repositoryName = repositoryName;
        this.logRepository = logRepository;
        this.configurations={
            h:{
                callback:this.callbackHelp,
            },
            n:{
                use:false,
                value:null,
                callback:()=>this.configurations.n.use=true,
            },
            oneline:{
                use:false,
                callback:()=>this.configurations.oneline.use=true,
            }
        };

    }
    execute(dataComand){
        let storage = JSON.parse(localStorage.getItem(this.repositoryName));
        if(storage === null){
            this.createMessage("error","Repository not found");
            return;
        }
        if(storage.commits.length === 0){
            this.createMessage("error","Repository is empty");
            return;
        }
        this.resetConfig();
        setTimeout(()=>this.removeClassLog(),1000);
        this.resolveConfig(dataComand);
        const startPoint = this.getCommitStartPoint(dataComand,storage.commits);
        const listCommits = this.resolveFiltersCommits(storage.commits,startPoint);
        const idListCommits = listCommits.map((commit)=>commit.id);
        storage.commits = storage.commits.map((commit)=>{
            if(idListCommits.includes(commit.id))
                commit.class.push('logging');
            return commit
        });
        if(this.configurations.oneline.use)
            this.generatorOnelineMessage(storage.information.head,listCommits);
        else
            this.generatorMessage(storage.information.head,listCommits);
        localStorage.setItem(this.repositoryName,JSON.stringify(storage));

    }
    removeClassLog = ()=>{
        let storage = JSON.parse(localStorage.getItem(this.repositoryName));
        storage.commits = storage.commits.map((commit)=>{
            commit.class = commit.class.filter((cl)=>cl !== 'logging');
            return commit;
        });
        localStorage.setItem(this.repositoryName,JSON.stringify(storage));
        
    }
    getCommitStartPoint(dataComand,commits){
        let startPoint = commits.find((commit)=>commit.id === dataComand.pop());
        if(startPoint === undefined)
            startPoint = commits.find((commit)=>commit.tags.includes(dataComand.pop()));
        if(startPoint === undefined)
            startPoint = commits.find((commit)=>commit.tags.includes('HEAD'));
        if(startPoint === undefined)
            startPoint = commits.find((commit)=>commit.tags.includes('master'));
        return startPoint;
    }
    resolveFiltersCommits(commits,commit){
        const childs = this.getAllParentsCommits(commits,commit);
        childs.sort((a,b)=>new Date(a.date)-new Date(b.date));
        if(this.configurations.n.use){
            if(this.configurations.n.value > childs.length)
                this.createMessage("error","The number of commits is greater than the number of commits the log has");
            else
                return childs.slice(this.configurations.n.value);
        }
        return childs;
    }
    getAllParentsCommits(commits,commit,childs=[commit]){
        const childsCommits = commits.filter((comt)=>comt.id == commit.parent);
        if(childsCommits.length === 0)
            return childs;
        childsCommits.forEach((child)=>{
            childs.push(child);
            childs.concat(...this.getAllParentsCommits(commits,child,childs));
        });
        return childs;
    }
    createMessage(tag,message){
        if(localStorage.getItem(this.logRepository)===null)
            localStorage.setItem(this.logRepository,JSON.stringify([]));
        const log = JSON.parse(localStorage.getItem(this.logRepository));
        log.push({tag,message});
        localStorage.setItem(this.logRepository,JSON.stringify(log));
    }
    resolveConfig(dataComand){
        dataComand.forEach((comand,index)=>{
            const clearComand = comand.replace(/^--?/,'').charAt(0);
            if(clearComand in this.configurations){
                this.configurations[clearComand].callback();
                if(this.configurations[clearComand].hasOwnProperty('value'))
                    this.configurations[clearComand].value = dataComand[index+1];
            }else if(/^\d+$/.test(clearComand)){
                this.configurations.n.value = parseInt(clearComand);
                this.configurations.n.use = true;
            }else
                throw new Error('Invalid option');
        });
    }
    resetConfig=()=>{
        console.log('reset');
        this.configurations.n.use = false;
        this.configurations.n.value = null;
        this.configurations.oneline.use = false;
        this.configurations.oneline.value = null;
    }
    generatorMessage(infoHead,commits){
        let message = '';
        commits.forEach((commit)=>{
            let tags = '';
            commit.tags.forEach((tag)=>{
                if(tag === 'HEAD'){
                    const head = infoHead.includes('detached')?infoHead.split(' ').pop():infoHead;
                    tags += `<b>HEAD</b>&nbsp;->&nbsp;${head},&nbsp`;
                }else if(tag !== infoHead)
                    tags += `${tag},&nbsp`;
            });
            message += `<p class="help underline">Commit:&nbsp;${commit.id}&nbsp;(${tags})</p>`;
            message += `<p class="help">Author:&nbsp;${commit.author?commit.author.name:undefined}&nbsp;&lt;${commit.author?commit.author.email:undefined}&gt;</p>`;
            message += `<p class="help">Date:&nbsp;&nbsp;&nbsp;${commit.date}</p>`;
            message += `<p class="help">${commit.message}</p>`;
        });
        this.createMessage("info",message);
    }
    generatorOnelineMessage(infoHead,commits){
        let message = '';
        commits.forEach((commit)=>{
            let tags = '';  
            commit.tags.forEach((tag)=>{
                if(tag === 'HEAD'){
                    const head = infoHead.includes('detached')?infoHead.split(' ').pop():infoHead;
                    tags += `<b>HEAD</b>&nbsp;->&nbsp;${head},&nbsp`;
                }else if(tag !== infoHead)
                    tags += `${tag},&nbsp`;
            });
            message += `<p class="help underline">Commit:&nbsp;${commit.id}&nbsp;(${tags})&nbsp;${commit.message}</p>`;
        });
        this.createMessage("info",message);
    }
    callbackHelp=()=>{
        let message = `
        <h5>Concept</h5>
        <p class="help">Show commit logs</p>
        <p class="help"><b>Start-point:</b> Can be a commit id or branch name</p>
        <h5>Syntax</h5>
        <p class="help">git log [-n &lt;number&gt;| -&lt;number&gt;] [start-point]</p>
        <p class="help">git log -h | --help</p>
        <h5>Configurations</h5>
        <h6 class="help">Optional</h6>
        <ul>
            <li class="help">-n &lt;number&gt;&nbsp;&nbsp;&nbsp;Limit the number of commits to show</li>
            <li class="help">[-h | --help]&nbsp;&nbsp;&nbsp;Show the help</li>
            <li class="help">[--oneline]&nbsp;&nbsp;&nbsp;This is a shorthand for "--pretty=oneline --abbrev-commit" used together.</li>
        </ul>`;
        this.createMessage("info",message);
        throw new Error('');
    }
    
}
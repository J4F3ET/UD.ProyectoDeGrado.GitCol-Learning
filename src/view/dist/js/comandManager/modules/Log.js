export class Log{
    constructor(repositoryName = 'repository',logRepository = 'log'){
        this.comand = 'log';
        this.repositoryName = repositoryName;
        this.logRepository = logRepository;

    }
    execute(){
        let storage = JSON.parse(localStorage.getItem(this.repositoryName));
        
    }
    createMessage(tag,message){
        if(localStorage.getItem(this.logRepository)===null)
            localStorage.setItem(this.logRepository,JSON.stringify([]));
        const log = JSON.parse(localStorage.getItem(this.logRepository));
        log.push({tag,message});
        localStorage.setItem(this.logRepository,JSON.stringify(log));
    }
    generatorMessage(storage){
        let message = '';
        storage.commits.forEach((commit)=>{
            let tags = '';
            commit.tags.forEach((tag)=>{
                if(tag === 'HEAD'){
                    const head = storage.information.head.includes('detached')?storage.information.head.split(' ').pop():storage.information.head;
                    tags += `<b>HEAD</b>&nbsp;->&nbsp;${head},&nbsp`;
                }else if(tag !== storage.information.head)
                    tags += `${tag},&nbsp`;
            });
            message += `<p class="help underline">Commit:&nbsp;${commit.id}&nbsp;(${tags})</p>`;
            message += `<p class="help">Author:&nbsp;${commit.author?commit.author.name:undefined}&nbsp;&lt;${commit.author?commit.author.email:undefined}&gt;</p>`;
            message += `<p class="help">Date:&nbsp;&nbsp;&nbsp;${commit.date}</p>`;
            message += `<p class="help">${commit.message}</p>`;
        });
        this.createMessage("info",message);
    }
    generatorOnelineMessage(storage){
        let message = '';
        storage.commits.forEach((commit)=>{
            let tags = '';  
            commit.tags.forEach((tag)=>{
                if(tag === 'HEAD'){
                    const head = storage.information.head.includes('detached')?storage.information.head.split(' ').pop():storage.information.head;
                    tags += `<b>HEAD</b>&nbsp;->&nbsp;${head},&nbsp`;
                }else if(tag !== storage.information.head)
                    tags += `${tag},&nbsp`;
            });
            message += `<p class="help underline">Commit:&nbsp;${commit.id}&nbsp;(${tags})&nbsp;${commit.message}</p>`;
        });
        this.createMessage("info",message);
    }
    
}
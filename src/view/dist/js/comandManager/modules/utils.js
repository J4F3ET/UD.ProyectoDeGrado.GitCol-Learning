/**
 * @namespace utils
 * @description Module with the utilities functions
 */
/**
 * @name removeTags
 * @function
 * @memberof utils
 * @description Remove tags from a commit
 * @param {String[]} tags Tags to be removed
 * @param {JSON} commit Commit to be removed the tag
 * @returns {Promise<JSON>} Commit with the tag removed
 */
async function removeTags(tags,commit){
    tags.forEach(tag => {
        commit.tags = commit.tags.filter(t => t != tag)
    });
    return commit;
}
/**
 * @name removeTagsInRepository
 * @function
 * @memberof utils
 * @description Remove tags in all repository
 * @param {String[]} tags Tags to be removed
 * @param {JSON[]} commits Array of commits
 * @returns {Promise<JSON[]>} Commits with the tag removed
 */
async function removeTagsInRepository(tags,commits){
    return await Promise.all(commits.map(async(commit) => {
        return removeTags(tags,commit)
    }))
}
/**
 * @name removeTagOfCommit
 * @function
 * @memberof utils
 * @description Remove a tag of a commit by id of the commit
 * @param {JSON[]} commits Array with the commits of the repository
 * @param {string} name Name of the tag to remove
 * @param {string} id Id of the commit
 * @returns {Promise<JSON[]>} Array with the new commits of the repository
 */
async function removeTagById(commits,name,id){
    return await Promise.all(commits.map(async commit => {
        if(commit.id === id && commit.tags.includes(name))
            commit = await removeTags([name],commit);
        return commit;
    }));
}
/**
 * @name implementTagsRemotesInRepository
 * @function
 * @memberof utils
 * @description Implement new tags whit prefic of parameter refRemote
 * @param {string} refRemote Name ref example "origin"
 * @param {Set<string>} commitsHeadRemote Set of id commits
 * @param {{changeMap:Map<string,string[]>}} changeMap Array of the object changes
 * @param {JSON[]} commits Array of commits
 * @returns {Promise<JSON[]>} Array with the new commits of the repository
 */
async function implementTagsRemotesInRepository(
    refRemote,
    commitsHeadRemote,
    changeMap,
    commits
){
    return await Promise.all(commits.map( async (commit,_,commits) =>{

        if(!changeMap.has(commit.id)) return commit

        return await resolveTagsInChange(
            commit,
            commits,
            commitsHeadRemote,
            changeMap,
            refRemote
        )
    }))
}
/**
 * @name resolveTagsInChange
 * @function
 * @memberof utils
 * @description Resolve conflic between tags of changes
 * @param {JSON} commit  Commit change
 * @param {JSON[]} commits Array of commits
 * @param {Set<string>} commitsHeadRemote Set of id commits
 * @param {{changeMap:Map<string,string[]>}} changeMap Array of the object changes
 * @param {string} refRemote Name ref example "origin"
 * @returns {Promise<JSON>} Commit with conflic resolved
 */
async function resolveTagsInChange(commit,commits,commitsHeadRemote,changeMap,refRemote){
    if(commitsHeadRemote.has(commit.id)){
        changeMap.get(commit.id).forEach(
            tag => commit.tags = [...commit.tags,refRemote+"/"+tag]
        )
        commits.forEach(commitForEach => {
            if(!commitForEach.tags.length || changeMap.has(commitForEach.id)) return

            changeMap.get(commit.id).forEach(tagMap =>{
                commitForEach.tags = commitForEach.tags.filter(t=> t != refRemote+"/"+tagMap)
            })
            
        })
    }
    if(commit.class.includes("detached-head"))
        commit.tags =  commit.tags.filter(tag => tag.includes(refRemote))

    return commit
}
/**
 * @name findAllTags
 * @function
 * @memberof utils
 * @description Find all tags in array to commits
 * @param {JSON[]} commits Array with the commits of the repository
 * @returns {Promise<String[]>} Array with tags name
 */
async function findAllTags(commits){
    const allTags = (await Promise.all(
        commits.map(async commit => commit.tags || [])
    )).flat();
    return allTags.filter(nameBranch => nameBranch && nameBranch !== 'HEAD');
}
/**
 * @name findAllChildrens
 * @function
 * @memberof utils
 * @description Find all the childrens of a commit by id
 * @param {JSON[]} commits Array with the commits of the repository
 * @param {string} id Id of the commit
 * @param {JSON[]} childrens Array with the childrens of the commit
 */
async function findAllChildrens(commits,id,childrens = []){
    const childrensFisrtGen = commits
        .filter(commitStorage => commitStorage.parent == id);
    if(childrensFisrtGen.length==0)
        return childrens;
    childrensFisrtGen.forEach(async commit => {
        childrens.push(commit);
        findAllChildrens(commits,commit.id,childrens);
    });
    return childrens;
}
/**
 * @name findAllParents
 * @function
 * @memberof utils
 * @description Find all parents of a commit
 * @param {JSON[]} commits Array of commits currents to repository
 * @param {JSON} commit Object representation a commit(register to repository)
 * @param {JSON[]} parents Array of commits that beloging to param commit
 * @return {Promise<JSON[]>} Array of commits that beloging to param commit
 */
async function findAllParents(commits,commit,parents=[]){
    if (!commit) return []
    const parentsCommits = commits.filter((comt)=>
            comt.id == commit.parent || commit.unions?.includes(comt.id)
        );
    if(parentsCommits.length === 0)
        return parents;
    parentsCommits.forEach(async (parent)=>{
        parents.push(parent);
        parents.concat(...(await findAllParents(commits,parent,parents)));
    });
    return parents;
}
/**
 * @name findLatestCommitsOfBranchs
 * @function
 * @memberof utils
 * @description Find the latest commits the all branches
 * @param {JSON[]} commits Array of commits
 * @returns {JSON[]} Array of commits that are the latest of the branches
 */
function findLatestCommitsOfBranchs(commits){
    const lastCommits = [];
    commits.forEach(commit => {
        if(commit.tags.length > 0 && !commit.class.includes('detached-head'))
            lastCommits.push(commit);
    });
    return lastCommits;
}   
/**
 * @name findCommitsDiffBetweenRepositories
 * @function
 * @memberof utils
 * @description Find the commits that are different between two repositories
 * @param {JSON[]} commitsDestination Array of commits of the destination(to) 
 * @param {JSON[]} commitsOrigin Array of commits of the origin(from)
 * @returns {Promise<JSON[]>} Array of commits that are different between the two repositories
 */
async function findCommitsDiffBetweenRepositories(commitsDestination,commitsOrigin){

    const destinationCommitId = new Set(
        await Promise.all(commitsDestination.map(async commit => commit.id))
    );
    const originCommitId = new Set(
        await Promise.all(commitsOrigin.map(async commit => commit.id))
    );

    const commitsDiff = originCommitId.difference(destinationCommitId)

    return commitsOrigin.filter(c => commitsDiff.has(c.id));
}
/**
 * @name getCommitStartPoint
 * @function
 * @memberof utils
 * @description Get the start-point requested by the user
 * @param {string[]} dataComand command data
 * @param {JSON[]} commits list of commits
 * @returns {Promise<JSON|undefined>} Commit object or undefined if the commit does not exist
 */
async function getCommitStartPoint(dataComand,commits){
    const lastData = dataComand[dataComand.length -1];
    let startPoint = commits.find((commit)=>commit.id === lastData);
    if(startPoint === undefined)
        startPoint = commits.find((commit)=>commit.tags.includes(lastData));
    return startPoint;
}
/**
 * @name getCommitStartPoint
 * @callback
 * @memberof utils
 * @description Get repository JSON
 * @param {string} key repository key
 * @returns {Promise<JSON|undefined>} Repository JSON
 */
const getRepository = async (key)=> JSON.parse(sessionStorage.getItem(key))
/**
 * @name createMessage
 * @function
 * @memberof utils
 * @description Create a message to the log
 * @param {String} tag Tag of the message
 * @param {String} message Message to be added to the log
 * @example createMessage('info','<div class="files"><h5>Add files to the commit</h5><ul><li>>index.html</li><li>>style.css</li><li>>script.js</li></ul></div>')
 */
async function createMessage(nameRefLog='log',tag='info',message){
    const log = await getRepository(nameRefLog);
    if(!log) return;
    sessionStorage.setItem(nameRefLog,JSON.stringify([...log,{tag,message}]));
}
/**
 * @memberof utils
 * @name resolveCreateMergeRegister
 * @function
 * @description Resolve the creation of the register in case that the commit fetch isn't parent of the commit head
 * @param {Object} storage Data of the repository
 * @param {JSON} commitFetch Commit fetch
 * @param {JSON} commitHead Commit head
 * @returns {Promise<Object>} newStorage
 */
async function resolveCreateMergeRegister(storage, commitFetch, commitHead){
    let {commits,commit} = await createRegister(
        storage.commits,
        commitHead,
        storage.information,
        'merge'
    );

    commit.unions.push(commitFetch.id);
    commits.push(commit);
    commitHead= await removeTags(['HEAD'],commitHead);
    commitHead =  await removeClassFromCommit(commitHead,"checked-out");
    
    if(!storage.information.head.includes('detached')){
        commitHead = await removeTags([storage.information.head],commitHead);
    }else
        storage.information.head = 'detached to '+commit.id;
    
    storage.commits = await updateCommitToCommits(commits,commitHead);

    if(commitFetch.class.includes("detached-head"))
        storage.commits = await changeDetachedCommitToCommit(commitFetch,storage.commits)

    return storage;
}
/**
 * @memberof utils
 * @name resolveMovilityTagInMerge
 * @method
 * @description Resolve the movility tag in case that the commit fetch is a parent of the commit head
 * @param {Object} storage Data of the repository
 * @param {JSON} commitFetch Commit fetch
 * @param {JSON} commitHead Commit head
 * @returns {Object} newStorage
 */
async function resolveMovilityTagInMerge(storage, commitFetch, commitHead){
    let commits = storage.commits;

    if(!storage.information.head.includes('detached')){
        commits =  await moveTagToCommit(commits,commitHead,commitFetch,storage.information.head);

        if(commitFetch.class.includes('detached-head'))
            commits = await changeDetachedCommitToCommit(commitFetch,commits);

    }else
        storage.information.head = 'detached to '+commitFetch.id;

    storage.commits = await updateHeadCommit(commits,commitHead, commitFetch);
    return storage;
}
/**
 * @name resolveIsHeadNull
 * @function
 * @memberof utils
 * @description Solution if HEAD is null or current not expecificate
 * @param {JSON} repository Object repository
 * @param {string} tagDefault Name of the deful branch or tag, value default is "master"
 * @returns {Promise<JSON>} repository object
 */
async function resolveIsHeadNull(repository,tagDefault = "master"){
    const tags = await findAllTags(repository.commits)
    const master = tags.find(t => t.includes(tagDefault))

    if(!master)
        return resolveIsHeadNull(repository,tags.shift()||"master")

    //Si existe HEAD buscara el commit head si no buscara master
    const findConditionalParameter = (repository.commits.some(c => c.tags.includes("HEAD"))?"HEAD":master)
    const commit = repository.commits.find((c) => c.tags.includes(findConditionalParameter))
    repository.information.head = commit.class.includes("detached-head")?
        "detached at "+ commit.id: master 

    for( const commitFor of repository.commits){
        if(commitFor.id == commit.id){
            commitFor.class.push("checked-out")
            commitFor.tags.push("HEAD")
            break
        }
    }

    return repository
}
/**
 * @name updateCommitToCommits
 * @function
 * @memberof utils
 * @description Update a commit in the local storage
 * @param {JSON[]} commits Array of commits
 * @param {JSON} newCommit New commit to be updated in the local storage
 * @returns {Promise<JSON[]>} Commit updated in the local storage
 */
async function updateCommitToCommits(commits,newCommit){
    commits.forEach(oldCommit => {
        if(oldCommit.id == newCommit.id){
            Object.assign(oldCommit, newCommit);
        }
    });
    return commits
}
/**
 * @name removeClassFromCommit
 * @function
 * @memberof utils
 * @description Remove a class from a commit
 * @param {JSON} commit Commit to be removed the class
 * @param {String} classToRemove Class to be removed
 * @returns {Promise<JSON>} Array to the class with classToRemove removed
 */
async function removeClassFromCommit(commit,classToRemove){
    commit.class = commit.class.filter(classC => classC !== classToRemove);
    return commit
}
/**
 * @name removeManyClassFromCommit
 * @function
 * @memberof utils
 * @description Remove a class from a commit
 * @param {JSON} commit Commit to be removed the class
 * @param {String[]} classToRemove Class to be removed
 * @returns {String[]} Array to the class with classToRemove removed
 */
function removeManyClassFromCommit(commit,classToRemove){
    return commit.class = commit.class.filter(classC => 
        !classToRemove.includes(classC)
    );
}
/**
 * @name removeClassInRepository
 * @function
 * @memberof utils
 * @description Remove a class in all repository
 * @param {JSON[]} commits Commits is array to the repository
 * @param {String[]} classToRemove Class to be removed
 * @returns {JSON[]} Commits with the class removed
 */
function removeClassInRepository(commits,classToRemove){
    return commits.map((commit) =>{
        commit.class = removeManyClassFromCommit(commit,classToRemove)
        return commit
    })
}
/**
 * @name existBranchOrEndPoint
 * @function
 * @memberof utils
 * @description Remove a class in all repository
 * @param {JSON[]} commits Commits is array to the repository
 * @param {String} branch Name the tag(branch)
 * @returns {Promise<boolean>} True if exist and false not exits 
 */
async function existBranchOrEndPoint(commits,branch){
    const tags = new Set([...(await findAllTags(commits)),"detached","HEAD"])
    const idCommits = new Set(await Promise.all(commits.map(async commit => commit.id)))
    return idCommits.has(branch) || tags.has(branch);
}
// *** SYSTEM OF RAMIFICATION BY COMMITS(REGISTERS)***
/**
 * @name SPACE_BETWEEN_COMMITS_X
 * @description Space between commits in the "X" axis
 * @type {Int}
 * @constant
 * @default 80
 * @memberof utils
 */
const SPACE_BETWEEN_COMMITS_X = 80;
/**
 * @name SPACE_BETWEEN_COMMITS_Y
 * @description Space between commits in the "Y" axis
 * @type {Int}
 * @constant
 * @default 80
 * @memberof utils
 */
const SPACE_BETWEEN_COMMITS_Y = 80;
/**
 * @name resolveLocationCommit
 * @function
 * @memberof utils
 * @description Resolve the location of the commit, dividing the problem in 3 cases
 * @param {JSON[]} commits Array of commits
 * @param {Int} parentCx Coordenate "X" of the parent commit(HEAD)
 * @param {Int} parentCy Coordenate "Y" of the parent commit(HEAD)
 * @returns {Promise<JSON>} Array of commits and the location of the new commit, the return Object contains whit the key "commits" and "location"
 */
async function resolveLocationCommit(commits,parentCx,parentCy){
    //Case 1
    const possibleX = parentCx + SPACE_BETWEEN_COMMITS_X;
    if(
        commits.find(
            commit => commit.cx == possibleX && commit.cy == parentCy
        ) == undefined
    )
        return {commits,location:[possibleX,parentCy]};	
    //Case 2
    const commitsInPossiteY = commits
        .filter(commit => commit.cx == possibleX && commit.cy < parentCy);

    const commitsInNegativeY = commits
        .filter(commit => commit.cx == possibleX && commit.cy > parentCy);

    const commitThisUbicationOnParentY = commits
        .filter(commit => commit.cx == parentCx && commit.cy != parentCy);
        
    if(commitThisUbicationOnParentY.length == 0){
        const possibleY = await generateLocationCommitCase2(
            parentCy,
            commitsInPossiteY,
            commitsInNegativeY
        )
        return {commits,location:[possibleX,possibleY]};
    }
    //Case 3
    const response = await generateLocationCommitCase3(
        commits,
        parentCy,
        commitsInPossiteY,
        commitsInNegativeY
    );
    return {commits:(response.commits),location:[possibleX,response.cy]};
}
/**
 * @name generateLocationCommitCase2
 * @function
 * @memberof utils
 * @description Generate the location "Y" of the commit in the case 2 
 * @param {Int} parentCy Coordenate "Y" of the parent commit(HEAD)
 * @param {JSON[]} commitsInPossiteY Commits that are above the "X" possible location
 * @param {JSON[]} commitsInNegativeY Commits that are below the "X" possible location
 * @returns {Promise<Int>} Coordenate "Y" of the new commit
 */
async function generateLocationCommitCase2(parentCy,commitsInPossiteY,commitsInNegativeY){
    if(commitsInPossiteY.length == 0)
        return parentCy - SPACE_BETWEEN_COMMITS_Y;

    if(commitsInNegativeY.length == 0)
        return parentCy + SPACE_BETWEEN_COMMITS_Y;
    
    if(commitsInPossiteY.length <= commitsInNegativeY.length)
        return commitsInPossiteY[commitsInPossiteY.length -1].cy - SPACE_BETWEEN_COMMITS_Y;
    else
        return commitsInNegativeY[commitsInNegativeY.length -1].cy + SPACE_BETWEEN_COMMITS_Y;
}
/**
 * @name generateLocationCommitCase3
 * @function
 * @memberof utils
 * @description Generate the location "Y" of the commit in the case 3 and update the location of the childs of the commit
 * @param {JSON[]} commits Array of commits
 * @param {Int} parentCy Coordenate "Y" of the parent commit(HEAD)
 * @param {JSON[]} commitsInPossiteY array of commits that are above the "X" possible location 
 * @param {JSON[]} commitsInNegativeY array of commits that are below the "X" possible location 
 * @returns {Promise<JSON>} Coordenate "Y" of the new commit and the array of commits updated, the return Object contains whit the key "commits" and "cy"
 */
async function generateLocationCommitCase3(commits,parentCy,commitsInPossiteY,commitsInNegativeY){
    if(commitsInPossiteY.length <= commitsInNegativeY.length){
        const SPACE_BETWEEN_COMMITS_Y_NEGATIVE = SPACE_BETWEEN_COMMITS_Y * (-1)
        commitsInPossiteY.forEach(async commit => {
            commits = await updateLocationChildsOfCommit(
                commits,
                SPACE_BETWEEN_COMMITS_Y_NEGATIVE,
                commit.id
            );
        });
        return {commits,cy:(parentCy - SPACE_BETWEEN_COMMITS_Y)}; 
    }else{  
        commitsInNegativeY.forEach(async commit => {
            commits = await updateLocationChildsOfCommit(
                commits,
                SPACE_BETWEEN_COMMITS_Y,
                commit.id);
        });
        return {commits,cy: (parentCy + SPACE_BETWEEN_COMMITS_Y)};
    }
}
/**
 * @name updateLocationChildsOfCommit
 * @function
 * @memberof utils
 * @description Update the location of the childs of a commit
 * @param {JSON[]} commits Array of commits
 * @param {Int} SPACE_BETWEEN_COMMITS_Y Space between commits in the "Y" axis(positive or negative)
 * @param {String} idCommitParent Id of the commit parent
 * @returns {Promise<JSON[]>} Array of commits updated
 */
async function updateLocationChildsOfCommit(commits,SPACE_BETWEEN_COMMITS_Y,idCommitParent){
    const childs = commits.filter(commit => commit.parent == idCommitParent);
    const commitParent = commits.find(c => c.id == idCommitParent);
    commitParent.cy = commitParent.cy + SPACE_BETWEEN_COMMITS_Y;
    if(childs.length != 0){
        childs.forEach(async child => {
            commits = await updateLocationChildsOfCommit(
                commits,
                SPACE_BETWEEN_COMMITS_Y,
                child.id);
        });
    }
    return await updateCommitToCommits(commits,commitParent);
}
/**
 * @name createCod
 * @function
 * @memberof utils
 * @description Create a random code of 7 characters
 * @returns {Promise<string>} Returns a random code of 7 characters
 */
async function createCod() {   
    const dictionary = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 7; i++) {
        const index = Math.floor(Math.random() * dictionary.length);
        code += dictionary.charAt(index);
    }
    return code;
}
/**
 * @name createRegister
 * @function
 * @memberof utils
 * @description Create a new commit and update the array of commits if it is necessary
 * @param {JSON[]} commits Array of commits
 * @param {JSON} parent  Commit parent to create the new commit
 * @param {String} currentHeadBranch Name of the current head branch
 * @returns {Promise<JSON>} Array of commits and JSON the new commit, the return Object contains whit the key "commits" and "commit"
 */
async function createRegister(commits,parent,information,message){
    let tags = [information.head,"HEAD"];
    const classList = ["commit","checked-out"];
    if(information.head.includes("detached")||parent.class.includes("detached-head")){
        tags = tags.filter(tag => tag != information.head);
        classList.push("detached-head");
    }
    const response = await resolveLocationCommit(commits,parent.cx,parent.cy);
    return {
        commits:(response.commits),
        commit:await newRegister(
            response.location[0],
            response.location[1],
            parent.id,
            message,
            tags,
            classList
        )
    }
}
/**
 * @name newRegister
 * @function
 * @memberof utils
 * @description Create a new commit
 * @param {int} cx Location in axis x
 * @param {int} cy  Location in axis y
 * @param {string} parent  Id the parent
 * @param {string} message Meesage of commit
 * @param {string[]} tags Array of the branchs
 * @param {string[]} classList Array of the class
 * @param {string} [autor=null] Autor name of commit
 * @param {string[]} [unions=[]] Array of the id commits of the commit
 * @returns {Promise<Object>} JSON the new commit
 */
async function newRegister(cx,cy,parent,message,tags,classList,autor = null,unions =[]){
    return {
        id: await createCod(),
        message,
        parent,
        unions,
        tags,
        class:classList,
        autor: autor??JSON.parse(sessionStorage.getItem('config')).user.autor??null,
        date: new Date().toLocaleString(),
        cx,
        cy
    }
}
/**
 * @name findAllExceptionCommitsToDelete
 * @function
 * @memberof utils
 * @description Find the parents of the commits
 * @param {JSON[]} commits Array with the commits of the repository
 * @returns {Array} Array with the ID parents of the commits
 */
function findAllExceptionCommitsToDelete(commits){
    const parents = commits.map(commit => 
        commit.parent&&!commit.class.includes('detached-head')?commit.parent:[]
    ).flat();
    if(parents.length === 0)
        return commits.filter(commit => commit.id == 'parent'|| commit.id == 'init');
    const repeatedParents = parents
        .filter((parent, index) => parents.indexOf(parent) != index);
    const parentsWithTags = commits
        .filter(commit => commit.tags.length > 0 && parents.includes(commit.id))
        .map(commit => commit.id);
    return [...new Set([...repeatedParents,...parentsWithTags])];
}
/**
 * @name deleteCommitsRecursivelyUntil
 * @function
 * @memberof utils
 * @description Remove the commits who it parent is not pertenecing to the array of points exceptions 
 * @param {JSON[]} commits Array with the commits of the repository
 * @param {JSON} commitObj Object with the commit
 * @param {String[]} pointsObjetive Array with the commits id parents whit two or more childrens
 * @returns {JSON[]} Array with the new commits of the repository
 */
function deleteCommitsRecursivelyUntil(commits,commitObj,pointsObjetive){
    if(pointsObjetive.includes(commitObj.id))
        return commits;
    const parent = commits.find(commit => commit.id === commitObj.parent);
    commits = commits.map(commit => {
        if(commit.id === commitObj.id)
            commitObj.class.push('detached-head');
        return commit;
    });
    return deleteCommitsRecursivelyUntil(commits,parent,pointsObjetive);
}
/**
 * @name currentHead
 * @function
 * @memberof utils
 * @description Returns the current head of the repository
 * @param {Object[]} commits Data of the local storage of the repository
 * @returns {Promise<JSON>} Data of the current head
 */
function currentHead(commits) {
    return commits.find(element => element.tags.includes('HEAD')); 
}
/**
 * @name changeDetachedCommitToCommit
 * @function
 * @memberof! utils
 * @description Change the class of the commit "detached-head" recursively to the parent commit
 * @param {JSON} commit Commit to change the class
 * @param {JSON[]} commits Array of commits(repository.commits)
 * @returns {Promise<JSON[]>} Array of commits with the new class
 */
async function changeDetachedCommitToCommit(commit,commits){
    if(!commit ||!commit.class.includes("detached-head"))
        return commits
    let parent;
    const newListCommits =await Promise.all(commits.map(async c=>{
        if(c.id == commit.id)
            c = await removeClassFromCommit(commit,"detached-head")
        if(c.id == commit.parent)
            parent = c
        return c
    }))
    await commit.unions.forEach(async union =>{
        const commitUnion = newListCommits.find(c=>c.id == union)
        newListCommits =  await changeDetachedCommitToCommit(commitUnion,newListCommits)
    }) 
    return await changeDetachedCommitToCommit(parent,newListCommits);
}
/**
 * @name updateHeadCommit
 * @function
 * @memberof utils
 * @description Update the head of the repository
 * @param {JSON[]} commits Array of commits
 * @param {JSON} oldHead Old head of the repository
 * @param {JSON} newHead New head of the repository
 * @returns {Promise<JSON[]>} Array of commits updated
 */
async function updateHeadCommit(commits,oldHead,newHead){
    newHead.tags.push('HEAD');
    oldHead.tags = oldHead.tags.filter(tag => tag != 'HEAD');
    newHead.class.push('checked-out');
    oldHead = await removeClassFromCommit(oldHead,'checked-out');
    commits = await updateCommitToCommits(commits,newHead);
    commits = await updateCommitToCommits(commits,oldHead);
    return commits;
}
/**	
 * @name moveTagToCommit
 * @function
 * @memberof utils
 * @description Move a tag to a commit
 * @param {JSON[]} commits Array of commits
 * @param {JSON} startCommit Commit where the tag is located
 * @param {JSON} destinationCommit Commit where the tag is going to be moved
 * @param {String} tag Tag to be moved
 * @returns {Promise<JSON[]>} Array of commits updated
 */
async function moveTagToCommit(commits,startCommit,destinationCommit,tag){
    startCommit.tags = startCommit.tags.filter(t => t != tag);
    destinationCommit.tags.push(tag);
    commits = await updateCommitToCommits(commits,startCommit);
    commits = await updateCommitToCommits(commits,destinationCommit);
    return commits;
}

//*** SYSTEM MERGE CHANGES***
/**	
 * @name findChangesBetweenBranchs
 * @function
 * @memberof utils
 * @description Find changes between repositories using branch especificated
 * @param {JSON[]} commitsDestination Array of commits destination of the changes
 * @param {JSON[]} commitsOrigin Array of commits origin
 * @param {String} nameBranch Name branch
 * @returns {Promise<JSON[]>} Array of commits changes between branch
 */
async function findChangesBetweenBranchs(commitsDestination,commitsOrigin,nameBranch){
    const commitHeadOrigin = commitsOrigin.find(
        commit => commit.tags.includes(nameBranch)
    )
    const historyBranchOrigin =  [...(await findAllParents(
        commitsOrigin,
        commitHeadOrigin
    )),commitHeadOrigin]
    
    const commitsDiffGlobal = await findCommitsDiffBetweenRepositories(
        commitsDestination,
        commitsOrigin
    )
    
    const commitsEquals = await findCommitsEqualBetweenRepositories(
        commitsDestination,
        historyBranchOrigin
    )
    
    const idCommitLinkDestination = await findCommitLink(
        await Promise.all(commitsEquals.map(async commit => commit.id)),
        await Promise.all(commitsDiffGlobal.map(async commit => commit.parent))
    )
    
    const commitHeadDestination = 
        commitsDestination.find((commit) => commit.tags.includes(nameBranch)) || 
        commitsDestination.find(commit => commit.id == idCommitLinkDestination)
        
    const historyBranchDestination  = commitHeadDestination?  [
        ...(await findAllParents(commitsDestination,commitHeadDestination)),
        commitHeadDestination
    ]:await findAllParents(commitsDestination,commitHeadDestination)

    return await copy(await findCommitsDiffBetweenRepositories(
        commitsDestination,
        await findCommitsDiffBetweenRepositories(
            historyBranchDestination,
            historyBranchOrigin
        )
    ))

}
/**	
 * @name mergeChangesInBranchs
 * @function
 * @memberof utils
 * @description Find changes between repositories using branch especificated
 * @param {JSON[]} commitsDestination Array of commits destination
 * @param {JSON[]} commitsOrigin Array of commits origin white the changes
 * @param {String} nameBranch Name of branch to merge
 * @returns {Promise<{changesId: Set<String>, repository: JSON[]}>} Array of commits(repository)
 */
async function mergeChangesInBranchs(commitsDestination,commitsOrigin,nameBranch){

    const commitsChanges = await Promise.all((await findChangesBetweenBranchs(
        commitsDestination,
        commitsOrigin,
        nameBranch
    )).map(async change =>{
        if(change.tags.length)
            change.tags = change.tags.filter(t => t == nameBranch)
        return change
    }))

    return {
        changesId : new Set(await Promise.all(commitsChanges.map(async c=>c.id))),
        repository :  await addChangesRecursivelyToRepository(
            commitsDestination,
            commitsChanges
        )
    }
}
async function copy(any){
    return JSON.parse(JSON.stringify(any))
}
/**	
 * @name addChangesRecursivelyToRepository
 * @function
 * @memberof utils
 * @description Add changes in commits(repository) array
 * @param {JSON[]} commits Array of commits destination of the changes
 * @param {JSON[]} changes Array of changes
 * @returns {Promise<JSON[]>} Array of commits(repository) with changes implemented
 */
async function addChangesRecursivelyToRepository(commits,changes){
    if(changes.length == 0)
        return commits
    const commitIdSet = new Set(
        commits.length != 0?
            commits.map(commit => commit.id):
            []
    );
    commitIdSet.add("init")
    const parentsChange = new Set(changes.map(c => c.parent))

    let idParent = null

    for(const parentIdofChange of parentsChange){
        if(commitIdSet.has(parentIdofChange)){
            idParent = parentIdofChange
            break
        }
    }
    if (!idParent){
        if(commits.length == 0)
            idParent = "init"
        else
            return commits
    }
    const change = changes.find(c =>c.parent == idParent)
    const parent = commits.find(c => c.id == idParent)
    const responseCommits = await addCommitChangeToBranch(commits,parent,change)
    const newChanges = changes.filter(c => c.id != change.id)
    return await addChangesRecursivelyToRepository(responseCommits,newChanges)
}
/**	
 * @name addCommitChangeToBranch
 * @function
 * @memberof utils
 * @description Add changes in commits(branch) array
 * @param {JSON[]} commitsDestination Array of commits destination of the changes
 * @param {JSON} parent Commit parent of change(commit)
 * @param {JSON} commit Commit change(commit)
 * @returns {Promise<JSON[]>} Array of commits(repository) with change implemented
 */
async function addCommitChangeToBranch(commitsDestination,parent = {cx:-30,cy:334},commit){
    const response = await resolveLocationCommit(
        commitsDestination,
        parent.cx,
        parent.cy
    )
    commit.cx = response.location[0]
    commit.cy = response.location[1]
    commit.class.push("detached-head")
    return [...response.commits,commit]
}
/**	
 * @name mergeChangesInRepositories
 * @function
 * @memberof utils
 * @description Merger changes in all repository or tags(branchs) especificate
 * @param {JSON[]} commitsDestination Array of commits destination of the changes
 * @param {JSON[]} commitsOrigin Array of commits origin of the changes
 * @param {Promise<Strign[]>|null} tagsPromise Names of branch
 * @returns {Promise<{changeMap:Map<string,string[]>,repository:JSON[]}>} changesId is array with ids, repository is array of commits
 */
async function mergeChangesInRepositories(
    commitsDestination,
    commitsOrigin,
    tagsPromise = findAllTags(commitsOrigin)
){
    const tags = await tagsPromise
    return await tags.reduce(async (accPromise, t) => {

            const commitHeadOrigin = commitsOrigin.find(c => c.tags.includes(t))
            const acc =  await accPromise

            if(acc.changeMap.has(commitHeadOrigin.id)){
                for (const commit of acc.repository) {
                    if(commitHeadOrigin.id != commit.id)
                        continue
                    commit.tags.push(t)
                    acc.changeMap.set(commit.id,commit.tags)
                    break
                }
                return acc
            }

            const { repository, changesId } = await mergeChangesInBranchs(
                acc.repository,
                commitsOrigin,
                t
            );

            changesId.forEach(change => acc.changeMap.set(change,[t]));
            acc.repository = repository;
            return acc;
        },
        Promise.resolve({ changeMap: new Map(), repository: commitsDestination })
    );
}
/**	
 * @name findCommitsHead
 * @function
 * @memberof utils
 * @description Find
 * @param {JSON[]} commits Array of the commits
 * @param {string} refRemote  By heads locals using refRemote example "origin" or not using refRemote by heads remotes 
 * @returns {Promise<{Set<string>}>} Set with ids of heads of commits
 */
async function findCommitsHead(commits,refRemote = null){  
    const heads = new Set()
    for (const commit of commits){

        if(refRemote && commit.tags.length){
            commit.tags.forEach(t=>{
                if(t.includes(refRemote))
                    heads.add(commit.id)
            })
        }else if(!refRemote && commit.tags.length){
            heads.add(commit.id)
        }
    }
    return heads
}
/**	
 * @name findCommitsChangeWithTags
 * @function
 * @memberof utils
 * @description Find changes and return map of the changes
 * @param {JSON[]} commits Array of the commits
 * @param {Set<string>} headsDiff  Set with commit ids
 * @returns {Promise<Map<string,string[]>>} Change map where key is id commit and value is the array with name tags(branch)
 */
async function findCommitsChangeWithTags(commits,headsDiff){
    const result = new Map()
    Promise.all(commits.map(async commit => {
        if(!headsDiff.has(commit.id))return
        
        commit.tags.forEach(tag => {
            result.set(commit.id,[...(result.get(commit.id)||[]),tag])
        })
    

    }));
    return result
}
/**
 * @name findCommitsEqualBetweenRepositories
 * @function
 * @memberof utils
 * @description Find the commits that are different between two repositories
 * @param {JSON[]} commitsDestination Array of commits of the destination(to) 
 * @param {JSON[]} commitsOrigin Array of commits of the origin(from)
 * @returns {Promise<JSON[]>} Array of commits that are equals between the two repositories
 */
async function findCommitsEqualBetweenRepositories(commitsDestination,commitsOrigin){
    const destinationCommitId = new Set(
        await Promise.all(commitsDestination.map(async commit => commit.id))
    );
    const originCommitId = new Set(
        await Promise.all(commitsOrigin.map(async commit => commit.id))
    );

    const commitsEquals = destinationCommitId.intersection(originCommitId);

    return (commitsDestination.filter( c => commitsEquals.has(c.id)))
}
/**
 * @name findCommitLink
 * @function
 * @memberof utils
 * @description Find the commit that are link between two array of commits
 * @param {JSON[]} idPotentialParents Array of commits of potential parents
 * @param {JSON[]} idParentsOfChildrens Array of commits of parents of the HEAD  
 * @returns {Promise<JSON|null>} Commit link or null
 */
async function findCommitLink(idPotentialParents,idParentsOfChildrens){
    return idParentsOfChildrens.find(
        idParentOfChild => idPotentialParents.includes(idParentOfChild)
    )|| null
}
export {
    changeDetachedCommitToCommit,
    createMessage,
    createRegister,
    currentHead,
    deleteCommitsRecursivelyUntil,
    existBranchOrEndPoint,
    findAllChildrens,
    findAllExceptionCommitsToDelete,
    findAllParents,
    findAllTags,
    findCommitsDiffBetweenRepositories,
    findCommitsHead,
    findCommitsChangeWithTags,
    findLatestCommitsOfBranchs,
    getCommitStartPoint,
    getRepository,
    mergeChangesInBranchs,
    mergeChangesInRepositories,
    moveTagToCommit,
    newRegister,
    implementTagsRemotesInRepository,
    removeClassFromCommit,
    removeClassInRepository,
    removeTagById,
    removeTags,
    removeTagsInRepository,
    resolveLocationCommit,
    resolveIsHeadNull,
    resolveMovilityTagInMerge,
    resolveCreateMergeRegister,
    updateCommitToCommits,
    updateHeadCommit
}
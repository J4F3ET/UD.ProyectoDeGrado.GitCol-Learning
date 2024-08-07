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
 * @returns {JSON} Commit with the tag removed
 */
function removeTags(tags,commit){
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
 * @returns {JSON[]} Commits with the tag removed
 */
function removeTagsInRepository(tags,commits){
    return commits.map((commit) => {
        return removeTags(tags,commit)
    })
}
/**
 * @name removeTagOfCommit
 * @function
 * @memberof utils
 * @description Remove a tag of a commit by id of the commit
 * @param {JSON[]} commits Array with the commits of the repository
 * @param {string} name Name of the tag to remove
 * @param {string} id Id of the commit
 * @returns {JSON[]} Array with the new commits of the repository
 */
function removeTagById(commits,name,id){
    return commits.map(commit => {
        if(commit.id === id && commit.tags.includes(name))
            commit.tags = commit.tags.filter(tag => tag !== name);
        return commit;
    });
}
/**
 * @name findAllTags
 * @function
 * @memberof utils
 * @description Find all tags in array to commits
 * @param {JSON[]} commits Array with the commits of the repository
 * @returns {String[]} Array with tags name
 */
function findAllTags(commits){
    return commits
        .flatMap(commit => commit.tags || [])
        .filter(nameBranch => nameBranch != 'HEAD')
}
/**
 * @name findChildrens
 * @function
 * @memberof utils
 * @description Find all the childrens of a commit by id
 * @param {JSON[]} commits Array with the commits of the repository
 * @param {string} id Id of the commit
 * @param {JSON[]} childrens Array with the childrens of the commit
 */
function findAllChildrens(commits,id,childrens = []){
    const childrensFisrtGen = commits
        .filter(commitStorage => commitStorage.parent == id);
    if(childrensFisrtGen.length==0)
        return childrens;
    childrensFisrtGen.forEach(commit => {
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
 * @return {JSON[]} Array of commits that beloging to param commit
 */
function findAllParents(commits,commit,parents=[]){
    const parentsCommits = commits.filter((comt)=>
            comt.id == commit.parent || commit.unions?.includes(comt.id)
        );
    if(parentsCommits.length === 0)
        return parents;
    parentsCommits.forEach((parent)=>{
        parents.push(parent);
        parents.concat(...findAllParents(commits,parent,parents));
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
 * @returns {JSON[]} Array of commits that are different between the two repositories
 */
function findCommitsDiffBetweenRepositories(commitsDestination,commitsOrigin){
    const commitsDiff = [];
    const destinationCommitId = new Set(commitsDestination.map(commit => commit.id));
    commitsOrigin.forEach(commitOrigin => {
        if(!destinationCommitId.has(commitOrigin.id))
            commitsDiff.push(commitOrigin);
    });
    return commitsDiff;
}
/**
 * @name getCommitStartPoint
 * @function
 * @memberof utils
 * @description Get the start-point requested by the user
 * @param {string[]} dataComand command data
 * @param {JSON[]} commits list of commits
 * @returns {JSON|undefined} Commit object or undefined if the commit does not exist
 */
function getCommitStartPoint(dataComand,commits){
    const lastData = dataComand[dataComand.length -1];
    let startPoint = commits.find((commit)=>commit.id === lastData);
    if(startPoint === undefined)
        startPoint = commits.find((commit)=>commit.tags.includes(lastData));
    return startPoint;
}
/**
 * @name createMessage
 * @function
 * @memberof utils
 * @description Create a message to the log
 * @param {String} tag Tag of the message
 * @param {String} message Message to be added to the log
 * @example createMessage('info','<div class="files"><h5>Add files to the commit</h5><ul><li>>index.html</li><li>>style.css</li><li>>script.js</li></ul></div>')
 */
function createMessage(nameRefLog='log',tag='info',message){
    if(sessionStorage.getItem(nameRefLog)===null)
        return;
    const log = JSON.parse(sessionStorage.getItem(nameRefLog));
    log.push({tag,message});
    sessionStorage.setItem(nameRefLog,JSON.stringify(log));
}
/**
 * @name updateCommitToCommits
 * @function
 * @memberof utils
 * @description Update a commit in the local storage
 * @param {JSON[]} commits Array of commits
 * @param {JSON} newCommit New commit to be updated in the local storage
 * @returns {JSON[]} Commit updated in the local storage
 */
function updateCommitToCommits(commits,newCommit){
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
 * @returns {String[]} Array to the class with classToRemove removed
 */
function removeClassFromCommit(commit,classToRemove){
    return commit.class = commit.class.filter(classC => classC !== classToRemove);
}
/**
 * @name removeClassInRepository
 * @function
 * @memberof utils
 * @description Remove a class in all repository
 * @param {JSON[]} commits Commits is array to the repository
 * @param {String} classToRemove Class to be removed
 * @returns {JSON[]} Commits with the class removed
 */
function removeClassInRepository(commits,classToRemove){
    return commits.map((commit) =>{
        if(commit.class.includes(classToRemove))
            commit.class = removeClassFromCommit(commit,classToRemove)
        return commit
    })
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
 * @returns {JSON} Array of commits and the location of the new commit, the return Object contains whit the key "commits" and "location"
 */
function resolveLocationCommit(commits,parentCx,parentCy){
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
        const possibleY = generateLocationCommitCase2(
            parentCy,
            commitsInPossiteY,
            commitsInNegativeY
        )
        return {commits,location:[possibleX,possibleY]};
    }
    //Case 3
    const response = generateLocationCommitCase3(
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
 * @returns {Int} Coordenate "Y" of the new commit
 */
function generateLocationCommitCase2(parentCy,commitsInPossiteY,commitsInNegativeY){
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
 * @returns {JSON} Coordenate "Y" of the new commit and the array of commits updated, the return Object contains whit the key "commits" and "cy"
 */
function generateLocationCommitCase3(commits,parentCy,commitsInPossiteY,commitsInNegativeY){
    if(commitsInPossiteY.length <= commitsInNegativeY.length){
        const SPACE_BETWEEN_COMMITS_Y_NEGATIVE = SPACE_BETWEEN_COMMITS_Y * (-1)
        commitsInPossiteY.forEach(commit => {
            commits = updateLocationChildsOfCommit(
                commits,
                SPACE_BETWEEN_COMMITS_Y_NEGATIVE,
                commit.id
            );
        });
        return {commits,cy:(parentCy - SPACE_BETWEEN_COMMITS_Y)}; 
    }else{  
        commitsInNegativeY.forEach(commit => {
            commits = updateLocationChildsOfCommit(
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
 * @returns {JSON[]} Array of commits updated
 */
function updateLocationChildsOfCommit(commits,SPACE_BETWEEN_COMMITS_Y,idCommitParent){
    const childs = commits.filter(commit => commit.parent == idCommitParent);
    const commitParent = commits.find(c => c.id == idCommitParent);
    commitParent.cy = commitParent.cy + SPACE_BETWEEN_COMMITS_Y;
    if(childs.length != 0){
        childs.forEach(child => {
            commits = updateLocationChildsOfCommit(
                commits,
                SPACE_BETWEEN_COMMITS_Y,
                child.id);
        });
    }
    return updateCommitToCommits(commits,commitParent);
}
/**
 * @name createCod
 * @function
 * @memberof utils
 * @description Create a random code of 7 characters
 * @returns {string} Returns a random code of 7 characters
 */
function createCod() {   
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
 * @returns {JSON} Array of commits and JSON the new commit, the return Object contains whit the key "commits" and "commit"
 */
function createRegister(commits,parent,information,message){
    let tags = [information.head,"HEAD"];
    const classList = ["commit","checked-out"];
    if(information.head.includes("detached")){
        tags = tags.filter(tag => tag != information.head);
        classList.push("detached-head");
    }
    const response = resolveLocationCommit(commits,parent.cx,parent.cy);
    return {commits:(response.commits),commit:{
        id: createCod(),
        message,
        parent: parent.id,
        unions: [],
        tags,
        class: classList,
        autor: information.config.user.autor??JSON.parse(sessionStorage.getItem('config')).user.autor??null,
        date: new Date().toLocaleString(),
        cx:response.location[0],
        cy:response.location[1]
    }};
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
 * @returns {JSON} Data of the current head
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
 * @param {JSON[]} commits Array of commits
 * @returns {JSON[]} Array of commits with the new class
 */
function changeDetachedCommitToCommit(commit,commits){
    if(!commit.class.includes("detached-head"))
        return commits
    let parent;
    const newListCommits = commits.map(c=>{
        if(c.id == commit.id)
            c.class = c.class.filter(item=> item !="detached-head")
        if(c.id == commit.parent)
            parent = c
        return c
    })
    return changeDetachedCommitToCommit(parent,newListCommits);
}
/**
 * @name updateHeadCommit
 * @function
 * @memberof utils
 * @description Update the head of the repository
 * @param {JSON[]} commits Array of commits
 * @param {JSON} oldHead Old head of the repository
 * @param {JSON} newHead New head of the repository
 * @returns {JSON[]} Array of commits updated
 */
function updateHeadCommit(commits,oldHead,newHead){
    newHead.tags.push('HEAD');
    oldHead.tags = oldHead.tags.filter(tag => tag != 'HEAD');
    newHead.class.push('checked-out');
    oldHead.class = oldHead.class.filter(classC => classC != 'checked-out');
    commits = updateCommitToCommits(commits,newHead);
    commits = updateCommitToCommits(commits,oldHead);
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
 * @returns {JSON[]} Array of commits updated
 */
function moveTagToCommit(commits,startCommit,destinationCommit,tag){
    startCommit.tags = startCommit.tags.filter(t => t != tag);
    destinationCommit.tags.push(tag);
    commits = updateCommitToCommits(commits,startCommit);
    commits = updateCommitToCommits(commits,destinationCommit);
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
 * @param {Callback} findCommit Callback function using by find changes
 * @returns {JSON[]} Array of commits changes between branch
 */
function findChangesBetweenBranchs(commitsDestination,commitsOrigin,findCommit){
    const commitHeadOrigin = commitsOrigin.find(findCommit)

    const historyBranchOrigin =  [...findAllParents(
        commitsOrigin,
        commitHeadOrigin
    ),commitHeadOrigin]
    
    const commitsDiffGlobal = findCommitsDiffBetweenRepositories(
        commitsDestination,
        commitsOrigin
    )
    
    const commitsEquals = findCommitsEqualBetweenRepositories(
        commitsDestination,
        historyBranchOrigin
    )
    
    const idCommitLinkDestination = findCommitLink(
        commitsEquals.map(commit => commit.id),
        commitsDiffGlobal.map(commit => commit.parent)
    )
    
    const commitHeadDestination = 
        commitsDestination.find(findCommit) || 
        commitsDestination.find(commit => commit.id == idCommitLinkDestination)
        
    const historyBranchDestination  = commitHeadDestination?  [
        ...findAllParents(commitsDestination,commitHeadDestination),
        commitHeadDestination
    ]:findAllParents(commitsDestination,commitHeadDestination)

    return findCommitsDiffBetweenRepositories(
        commitsDestination,
        findCommitsDiffBetweenRepositories(
            historyBranchDestination,
            historyBranchOrigin
        )
    )

}
/**	
 * @name findChangesBetweenBranchs
 * @function
 * @memberof utils
 * @description Find changes between repositories using branch especificated
 * @param {JSON[]} commitsDestination Array of commits destination
 * @param {JSON[]} commitsOrigin Array of commits origin white the changes
 * @param {String} nameBranch Name of branch to merge
 * @returns {JSON[]} Array of commits(repository)
 */
function mergeChangesInBranchs(commitsDestination,commitsOrigin,nameBranch){
    const commitsChanges = findChangesBetweenBranchs(
        commitsDestination,
        commitsOrigin,
        (commit) => commit.tags.includes(nameBranch)
    ) 
    commitsChanges.forEach(change =>{
        if(change.tags != 0)
            change.tags = change.tags.filter(t => t==nameBranch)
    })
    return addChangesRecursivelyToRepository(
        removeTagsInRepository(
            commitsChanges.flatMap(change => change.tags),
            commitsDestination
        ),
        commitsChanges
    )
}
/**	
 * @name addChangesRecursivelyToRepository
 * @function
 * @memberof utils
 * @description Add changes in commits(repository) array
 * @param {JSON[]} commits Array of commits destination of the changes
 * @param {JSON[]} changes Array of changes
 * @returns {JSON[]} Array of commits(repository) with changes implemented
 */
function addChangesRecursivelyToRepository(commits,changes){
    if(changes.length == 0)
        return commits
    const commitIdSet = new Set(
        commits.length != 0?
            commits.map(commit => commit.id):
            []
    );
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
    const responseCommits = addCommitChangeToBranch(commits,parent,change)
    const newChanges = changes.filter(c => c.id != change.id)
    return addChangesRecursivelyToRepository(responseCommits,newChanges)
}
/**	
 * @name addCommitChangeToBranch
 * @function
 * @memberof utils
 * @description Add changes in commits(branch) array
 * @param {JSON[]} commitsDestination Array of commits destination of the changes
 * @param {JSON} parent Commit parent of change(commit)
 * @param {JSON} commit Commit change(commit)
 * @returns {JSON[]} Array of commits(repository) with change implemented
 */
function addCommitChangeToBranch(commitsDestination,parent = {cx:-30,cy:334},commit){
    const response = resolveLocationCommit(
        commitsDestination,
        parent.cx,
        parent.cy
    )
    commit.cx = response.location[0]
    commit.cy = response.location[1]
    return [...response.commits,commit]
}

function mergeRepositoriesChanges(){
    throw new Error('NOT IMPLEMENT')
}
/**
 * @name findCommitsEqualBetweenRepositories
 * @function
 * @memberof utils
 * @description Find the commits that are different between two repositories
 * @param {JSON[]} commitsDestination Array of commits of the destination(to) 
 * @param {JSON[]} commitsOrigin Array of commits of the origin(from)
 * @returns {JSON[]} Array of commits that are equals between the two repositories
 */
function findCommitsEqualBetweenRepositories(commitsDestination,commitsOrigin){
    const commitsEqual = [];
    const destinationCommitId = new Set(commitsDestination.map(commit => commit.id));
    commitsOrigin.forEach(commitOrigin => {
        if(destinationCommitId.has(commitOrigin.id))
            commitsEqual.push(commitOrigin);
    });
    return commitsEqual;
}

function findCommitLink(idPotentialParents,idParentsOfChildrens){
    return idParentsOfChildrens.find(
        idParentChild => idPotentialParents.includes(idParentChild)
    )|| null
}

export {
    removeTags,
    removeTagById,
    removeTagsInRepository,
    findAllTags,
    createMessage,
    updateCommitToCommits,
    removeClassFromCommit,
    removeClassInRepository,
    resolveLocationCommit,
    createRegister,
    findAllChildrens,
    findAllParents,
    findLatestCommitsOfBranchs,
    findCommitsDiffBetweenRepositories,
    getCommitStartPoint,
    deleteCommitsRecursivelyUntil,
    findAllExceptionCommitsToDelete,
    createCod,
    changeDetachedCommitToCommit,
    currentHead,
    updateHeadCommit,
    moveTagToCommit,
    mergeChangesInBranchs
}
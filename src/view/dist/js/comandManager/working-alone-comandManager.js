import { ComandManager } from "./ComandManager.js";
import {Commit} from "./modules/Commit.js";
import {Init} from "./modules/Init.js";
import {Branch} from "./modules/Branch.js";
import {Checkout} from "./modules/Checkout.js";
import {Log} from "./modules/Log.js";
import {Merge} from "./modules/Merge.js";
const REPOSITORYNAME = "local"
const LOGNAME = "log"
const workingAloneComandManager = new ComandManager();
if(localStorage.getItem('config')===null)
    localStorage.setItem('config',JSON.stringify({user:{ name:null, email:null }}));
workingAloneComandManager.addComand("init",new Init(REPOSITORYNAME));
workingAloneComandManager.addComand("commit",new Commit(REPOSITORYNAME,LOGNAME));
workingAloneComandManager.addComand("checkout",new Checkout(REPOSITORYNAME,LOGNAME));
workingAloneComandManager.addComand("branch",new Branch(REPOSITORYNAME,LOGNAME,null));
workingAloneComandManager.addComand("log",new Log(REPOSITORYNAME,LOGNAME));
workingAloneComandManager.addComand("merge",new Merge(REPOSITORYNAME,LOGNAME));
export { workingAloneComandManager };
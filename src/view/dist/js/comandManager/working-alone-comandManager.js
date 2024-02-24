import { ComandManager } from "./ComandManager.js";
import {Commit} from "./modules/Commit.js";
import {Init} from "./modules/Init.js";
import {Branch} from "./modules/Branch.js";
const REPOSITORYNAME = "local"
const LOGNAME = "log"
const workingAloneComandManager = new ComandManager();
workingAloneComandManager.addComand("init",new Init(REPOSITORYNAME));
workingAloneComandManager.addComand("commit",new Commit(REPOSITORYNAME,LOGNAME));
workingAloneComandManager.addComand("branch",new Branch(REPOSITORYNAME,LOGNAME));
export { workingAloneComandManager };
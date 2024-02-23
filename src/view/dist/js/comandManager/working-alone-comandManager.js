import { ComandManager } from "./ComandManager.js";
import {Commit} from "./modules/Commit.js";
import {Init} from "./modules/Init.js";
const REPOSITORYNAME = "local"
const LOGNAME = "log"
const workingAloneComandManager = new ComandManager();
workingAloneComandManager.addComand("init",new Init(REPOSITORYNAME));
workingAloneComandManager.addComand("commit",new Commit(REPOSITORYNAME,LOGNAME));
export { workingAloneComandManager };
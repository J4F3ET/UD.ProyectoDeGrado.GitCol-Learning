import { ComandManager } from "./ComandManager.js";
import {Commit} from "./modules/Commit.js";
import {Init} from "./modules/Init.js";
const workingAloneComandManager = new ComandManager();
workingAloneComandManager.addComand("init",new Init());
workingAloneComandManager.addComand("commit",new Commit());
export { workingAloneComandManager };
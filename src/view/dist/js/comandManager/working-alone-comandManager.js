import { ComandManager } from "./ComandManager.js";
import {Commit} from "./modules/Commit.js";
import {Init} from "./modules/Init.js";
import {Branch} from "./modules/Branch.js";
import {Checkout} from "./modules/Checkout.js";
import {Log} from "./modules/Log.js";
import {Merge} from "./modules/Merge.js";
const COMMANDMAPPINGS  = {
    "init": Init,
    "commit": Commit,
    "checkout": Checkout,
    "branch": Branch,
    "log": Log,
    "merge": Merge
}
/**
 * @name factoryCommandManager
 * @description Create a command manager
 * @param {String[]} commands
 * @param {String[]} args
 * @returns {ComandManager}
 */
export const factoryCommandManager = (commands,args) => {
    const commandManager = new ComandManager(args[1]);
    if(localStorage.getItem('config')===null)
        localStorage.setItem('config',JSON.stringify({user:{ name:null, email:null }}));
    commands.forEach((command) => {
        commandManager.addComand(command,new COMMANDMAPPINGS[command](...args));
    });
    return commandManager;
};
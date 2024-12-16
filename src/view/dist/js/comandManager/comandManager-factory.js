import {ComandManager} from "./ComandManager.js";
const COMMANDMAPPINGS = {
	init: "./modules/Init.js",
	commit: "./modules/Commit.js",
	checkout: "./modules/Checkout.js",
	branch: "./modules/Branch.js",
	log: "./modules/Log.js",
	merge: "./modules/Merge.js",
	fetch: "./modules/Fetch.js",
	push: "./modules/Push.js",
	clone: "./modules/Clone.js",
	pull: "./modules/Pull.js",
};
const dynamicImportCommnad = async (command) => {
	return (await import(COMMANDMAPPINGS[command]))[
		command.charAt(0).toUpperCase() + command.slice(1)
	];
};
/**
 * @name factoryCommandManager
 * @description Create a command manager
 * @param {String[]} commands
 * @param {String[]} args
 * @returns {ComandManager}
 */
export const factoryCommandManager = (commands, args) => {
	const commandManager = new ComandManager(args[1]);

	if (sessionStorage.getItem("config") === null)
		sessionStorage.setItem(
			"config",
			JSON.stringify({user: {name: null, email: null}})
		);

	commands.forEach(async (command) => {
		commandManager.addComand(
			command,
			new (await dynamicImportCommnad(command))(...args)
		);
	});
	return commandManager;
};

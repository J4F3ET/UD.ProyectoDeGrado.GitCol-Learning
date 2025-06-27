import { ComandManager } from "./ComandManager.js";
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
const loadConcept = async () => {
	const { changeConcept } = await import("../utils/concept-config.js");
	changeConcept(CONCEPT).then(async () => {
		const { observer } = await import("../mode-script.js");
		observer.notify(sessionStorage.getItem(REF_STORAGE_LOG));
	});
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
			JSON.stringify({ user: { name: null, email: null } })
		);

	Promise.all(
		commands.map(async (command) => {
			commandManager.addComand(
				command,
				new (await dynamicImportCommnad(command))(...args)
			);
		})
	).then(() => {
		if (REF_STORAGE_REPOSITORY_CLOUD) return;
		loadConcept();
	});
	return commandManager;
};

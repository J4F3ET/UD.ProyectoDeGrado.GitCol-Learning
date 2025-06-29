import { DataViewer } from "./dataViewer/DataViewer.js";
import { factoryCommandManager } from "./comandManager/comandManager-factory.js";
import { Observer } from "./dataViewer/Observer.js";
const listCommands = ["init", "commit", "checkout", "branch", "log", "merge"];
if (REF_STORAGE_REPOSITORY_CLOUD) {
	listCommands.push("push", "clone", "fetch", "pull");
}
const messageCallback = (listCommand) => {
	let messageString = `
        <h5 class="help">Commands shell</h5>
        <p class="help">>clear</p>
        <p class="help">>help</p>
        <h5 class="help">Commands git</h5>`;
	listCommand.forEach((commandString) => {
		messageString += `<p class="help">>git ${commandString}</p>`;
	});
	return (messageString += `
        <p class="help">
            More information using 'git &lt;comand&gt; [-h|--help]'
        </p>`);
};
const DEFAULT_MESSAGE = {
	tag: "info",
	message: messageCallback(listCommands),
};

const aloneModeCommandManager = factoryCommandManager(listCommands, [
	REF_STORAGE_REPOSITORY,
	REF_STORAGE_LOG,
	REF_STORAGE_REPOSITORY_CLOUD,
]);
let stateExecution = false;
const commandsQueue = [];
let listComands =
	JSON.parse(sessionStorage.getItem(REF_STORAGE_LOG))
		?.filter((log) => log.tag === "comand")
		?.map((log) => log.message) || [];
const dataViewerLocal = new DataViewer(document.getElementById("svgContainer"));
export const observer = new Observer();
let accountComands = listComands.length;
// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => init());
document.getElementById("comandInput").addEventListener("keyup", async (e) => {
	if (e.key === "ArrowUp") {
		accountComands =
			accountComands == 0 ? listComands.length - 1 : accountComands - 1;
		e.target.value = listComands[accountComands] || "";
		return;
	}
	if (e.key === "ArrowDown") {
		accountComands =
			accountComands >= listComands.length - 1 ? 0 : accountComands + 1;
		e.target.value = listComands[accountComands] || "";
		return;
	}
	if (e.key === "Enter") {
		if (stateExecution) {
			commandsQueue.push(e.target.value);
			e.target.value = "";
			return;
		}
		eventEnter(e);
	}
});
const deQueueCommand = async () => {
	if (commandsQueue.length == 0) return;
	const command = commandsQueue.shift();
	return executeCommand(command);
};
const deQueueCommands = async () => {
	while (commandsQueue.length > 0) {
		await deQueueCommand();
	}
	return true;
};

const eventEnter = async (e) => {
	stateExecution = true;
	await executeCommand(e.target.value);
	e.target.value = "";
	listComands = JSON.parse(sessionStorage.getItem(REF_STORAGE_LOG))
		.filter((log) => log.tag === "comand")
		.map((log) => log.message);
	accountComands = listComands.length;
	stateExecution = !(await deQueueCommands());
};
// FUNCTIONS
const init = () => {
	dataViewerLocal.currentData = null;
	dataViewerLocal.logComands = null;
	if (sessionStorage.getItem(REF_STORAGE_LOG) === null)
		sessionStorage.setItem(REF_STORAGE_LOG, JSON.stringify([DEFAULT_MESSAGE]));
	observer.notify(sessionStorage.getItem(REF_STORAGE_LOG));
	observer.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY));
};
/**
 * @name executeCommand
 * @description Execute the comand and show the result
 * @param {String} comand
 */
const executeCommand = async (comand) => {
	const promise = new Promise((resolve) => {
		setTimeout(() => {
			observer.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY));
			resolve();
		}, 500);
	});
	comand !== ""
		? aloneModeCommandManager.createMessage("comand", comand)
		: null;
	try {
		await aloneModeCommandManager.executeCommand(comand.trim());
		observer.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY));
	} catch (error) {
		aloneModeCommandManager.createMessage("error", error.message);
	} finally {
		observer.notify(sessionStorage.getItem(REF_STORAGE_LOG));
		return promise;
	}
};
// OBSERVER
observer.subscribe(dataViewerLocal);
// ZONE VIEW (EFECS AND OBSERVERS)
const containerLogs = document.getElementById("logContainer");
const containerSvg = document.getElementById("svgContainer");
const observerScroll = new MutationObserver(
	() => (containerLogs.scrollTop = containerLogs.scrollHeight)
);
const observerScrollSvgHorizontal = new MutationObserver(
	() => (containerSvg.scrollLeft = containerSvg.scrollWidth)
);
observerScroll.observe(containerLogs, { childList: true });
observerScrollSvgHorizontal.observe(containerSvg, {
	childList: true,
	subtree: true,
});

// MODULE MULTI-MODE
const observerCloud = new Observer();
const containerSvgCloud = document.getElementById("svgContainerCloud");
if (containerSvgCloud) {
	const dataViewerCloud = new DataViewer(
		document.getElementById("svgContainerCloud")
	);
	observerCloud.subscribe(dataViewerCloud);
	observerCloud.notify(sessionStorage.getItem(REF_STORAGE_REPOSITORY_CLOUD));
	const observerScrollSvgHorizontalCloud = new MutationObserver(
		() => (containerSvgCloud.scrollLeft = containerSvgCloud.scrollWidth)
	);
	observerScrollSvgHorizontalCloud.observe(containerSvgCloud, {
		childList: true,
		subtree: true,
	});
}
export { observerCloud };

// MODULE CONSOLE LOG
export const logConceptChallenge = async (tag, message) =>
	aloneModeCommandManager.createMessage(tag, message);
const eventHelp = async (e) => {
	document.querySelectorAll(".challenge-command-help")?.forEach((element) => {
		element.addEventListener("click", () => {
			const command = element.textContent + " -h";
			executeCommand(command.includes("git") ? command : "help");
		});
	});
};
setTimeout(eventHelp, 1000);

import {
	createMessage,
	currentHead,
	findAllParents,
	getCommitStartPoint,
	resolveCreateMergeRegister,
	resolveMovilityTagInMerge,
	getRepository,
} from "./utils.js";
import {
	errorNotInitialized,
	errorCommitNotFound,
	errorAlreadyUpToDate,
	errorEmptyRepository,
} from "./error.js";
/**
 * @class
 * @classesc Join two or more development histories together
 * @requires utils
 */
export class Merge {
	_comand = "merge";
	/**
	 * @memberof Merge#
	 * @description Member is responsible of save the configurations of the merge
	 * @tydef {Object} _configurationsOfMerge
	 * @property {Object<Function>} h
	 * @property {Function} h.callback
	 */
	_configurations = {
		h: {
			callback: async () => {
				this.callbackHelp();
			},
		},
	};
	/**
	 * @memberof Merge#
	 * @description Member is responsible of save the name of the reference repository
	 * @member
	 * @property {String} _dataRepository
	 * @default 'repository'
	 */
	_dataRepository = "repository";
	/**
	 * @memberof Merge#
	 * @description Member is responsible of save the name of the log repository
	 * @member
	 * @property {String} _logRepository
	 * @default 'log'
	 */
	_logRepository = "log";
	/**
	 * @memberof Merge#
	 * @description Returns of intance of the class
	 * @param {string} dataRepository
	 * @param {string} logRepository
	 * @constructor
	 */
	constructor(dataRepository, logRepository) {
		this._dataRepository = dataRepository;
		this._logRepository = logRepository;
	}
	/**
	 * @memberof Merge#
	 * @name execute
	 * @method
	 * @description Execute the merge command
	 * @param {string[]} dataComand
	 * @throws {Error} The repository is not initialized
	 * @throws {Error} There are no branch master
	 */
	async execute(dataComand) {
		let storage = await getRepository(this._dataRepository);

		if (!storage) throw errorNotInitialized(this._comand);

		if (!storage.commits.length) throw errorEmptyRepository(this._comand);

		if (!(await this.resolveConfiguration(dataComand))) return;

		const commitFetch = await getCommitStartPoint(dataComand, storage.commits);

		if (!commitFetch) throw errorCommitNotFound(this._comand);

		const parentsCommitFetch = await Promise.all(
			(
				await findAllParents(storage.commits, commitFetch)
			).map(async (commit) => commit.id)
		);

		const commitHead = await currentHead(storage.commits);

		const parentsCommitHead = await Promise.all(
			(
				await findAllParents(storage.commits, commitHead)
			).map(async (commit) => commit.id)
		);

		if (parentsCommitHead.includes(commitFetch.id))
			throw errorAlreadyUpToDate(this._comand);

		if (parentsCommitFetch.includes(commitHead.id))
			storage = await resolveMovilityTagInMerge(
				storage,
				commitFetch,
				commitHead
			);
		else
			storage = await resolveCreateMergeRegister(
				storage,
				commitFetch,
				commitHead
			);

		sessionStorage.setItem(this._dataRepository, JSON.stringify(storage));
	}
	/**
	 * @memberof Merge#
	 * @name resolveConfiguration
	 * @method
	 * @description Resolve the configurations of the merge
	 * @param {string[]} dataComand
	 */
	async resolveConfiguration(dataComand) {
		let continueProcess = true;
		if (dataComand.includes("-h"))
			continueProcess = await this._configurations.h.callback();
		return continueProcess;
	}
	/**
	 * @memberof Merge#
	 * @name callbackHelp
	 * @callback Merge~callbackHelp
	 * @description Show the message of help
	 * @param {string} message
	 */
	callbackHelp = async () => {
		let message = `
        <h5>Concept</h5>
        <p class="help">Join two or more development histories together</p>
        <p class="help"><b>Start-point:</b> Can be a commit id or branch name</p>
        <h5>Syntax</h5>
        <p class="help">git merge <start-point></p>
        <p class="help">git merge -h</p>
        <h5>Configurations</h5>
        <ul>
            <li><p class="help">-h,--help &nbsp;&nbsp;&nbsp;Show the message</p></li>
        </ul>`;
		createMessage(this._logRepository, "info", message);
		return false;
	};
}

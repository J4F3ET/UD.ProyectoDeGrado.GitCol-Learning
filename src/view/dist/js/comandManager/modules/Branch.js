import {
	currentHead,
	createMessage,
	findAllChildrens,
	deleteCommitsRecursivelyUntil,
	findAllExceptionCommitsToDelete,
	removeTagById,
	existBranchOrEndPoint,
	changeDetachedCommitToCommit,
	getRepository,
	findAllTags,
} from "./utils.js";
import {
	ErrorModule,
	errorNotInitialized,
	errorNotConfiguration,
} from "./error.js";
/**
 * @class
 * @classdesc Class to manage the branch of the repository
 * @requires util
 */
export class Branch {
	_comand = "branch";
	/**
	 * @typedef {Object} _configurationsOfBranch
	 * @description Configurations who can be supported by the command, it is an object with the following properties
	 * @property {Object<Function>} c Configurations to create a branch.
	 * @property {Function} c.callback Callback do resposability to create a new branch.
	 * @property {Object<Function>} d Delete a branch in the repository.The property is the similitude with Git. [-d | --delete]
	 * @property {Function} d.callback Callback do responsability to delete a branch.
	 * @property {Object<Function>} r List the remote branches of the repository. The property is the similitude with Git. [-r | --remote]
	 * @property {Function} r.callback Callback do responsability to generate a message with the remote branches.
	 * @property {Object<Function>} a List all branches of the repository. The property is the similitude with Git. [-a | --all]
	 * @property {Function} a.callback Callback do responsability to generate a message with the local branches and the remote branches.
	 * @property {Object<Function>} l List the local branches of the repository. The property is the similitude with Git. [-l | --list]
	 * @property {Function} l.callback Callback do responsability to generate a message with the local branches.
	 * @property {Object<Function>} m Rename a branch in the repository. The property is the similitude with Git. [-m | --move]
	 * @property {Function} m.callback Callback do responsability to rename a branch.
	 * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
	 * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
	 * @alias _configurations
	 * @readonly
	 * @memberof! Branch#
	 */
	_configurations = {
		c: {
			callback: async (storage, values) =>
				this.callBackCreateBranch(storage, values),
		},
		d: {
			callback: async (storage, values) =>
				this.callBackConfigDelete(storage, values),
		},
		r: {
			callback: async () => this.callBackConfigRemoteBranch(),
		},
		a: {
			callback: async (storage) => this.callBackConfigAllBranch(storage),
		},
		l: {
			callback: async (storage) => this.callBackConfigList(storage),
		},
		m: {
			callback: async (storage, branchs) =>
				this.callBackConfigRename(storage, branchs),
		},
		h: {
			callback: async () => this.callbackHelp(),
		},
	};
	/**
	 * @type {string}
	 * @description Name of the space where the repository is saved
	 * @default 'repository'
	 * @memberof! Branch#
	 * @member
	 * @readonly
	 */
	_dataRepository = "repository";
	/**
	 * @type {string}
	 * @description Name of the space where the log is saved
	 * @default 'log'
	 * @memberof! Branch#
	 * @member
	 * @readonly
	 */
	_logRepository = "log";
	/**
	 * @type {string}
	 * @description Name of the space where the remote repository is saved
	 * @default null
	 * @memberof! Branch#
	 * @member
	 * @readonly
	 */
	_remoteRepository = null;
	/**
	 * @constructor
	 * @description The constructor of the class, it receives the repository of the data
	 * @param {string} dataRepository Name of variable of the local storage of the data, by default is 'repository'
	 * @param {string} logRepository Name variable of the local storage of the log, by default is 'log'
	 * @param {string} remoteRepository Name variable of the local storage of the remote repository, by default is null
	 */
	constructor(dataRepository, logRepository, remoteRepository = null) {
		this._dataRepository = dataRepository;
		this._logRepository = logRepository;
		this._remoteRepository = remoteRepository;
	}
	/**
	 * @name comand
	 * @type {string}
	 * @description Name of the command
	 * @default branch
	 * @memberof! Branch##
	 * @readonly
	 */
	get comand() {
		return this._comand;
	}
	/**
	 * @name execute
	 * @description Execute the comand with the configurations
	 * @throws {Error} If the repository is not initialized
	 * @throws {Error} If there are no branch master
	 * @throws {Error} If the comand is not valid
	 * @memberof Branch#
	 * @method
	 * @param {Array} dataComand Array with the comand and the configurations
	 */
	async execute(dataComand) {
		let storage = await getRepository(this._dataRepository);
		if (dataComand.includes("-h")) return this.callbackHelp();
		if (!storage) throw errorNotInitialized(this._comand);

		const [comand, ...value] = this.resolveConfiguration(dataComand);

		if (!comand) throw errorNotConfiguration(this._comand, dataComand);

		if (storage.commits.length === 0) return;

		storage = (await comand.callback(storage, value)) ?? storage;

		sessionStorage.setItem(this._dataRepository, JSON.stringify(storage));
	}
	/**
	 * @name resolveConfiguration
	 * @description Resolve the comand and return the configuration
	 * @method
	 * @memberof Branch#
	 * @param {string[]} dataComand Array with the comand and the configurations
	 * @returns {Promise<Array<Function,string>>} Array with the configuration and the values of the comand
	 */
	resolveConfiguration(dataComand) {
		if (dataComand.length === 0) return [this._configurations["l"], null];

		if (dataComand[0].substring(0, 1) !== "-")
			return [this._configurations["c"], dataComand[0]];

		const comand = dataComand[0].replace(/^--?/, "").charAt(0);

		return [this._configurations[comand], ...dataComand.slice(1)];
	}
	/**
	 * @name detachedBranchAsoociated
	 * @memberof Branch#
	 * @method
	 * @description Find the branch associated to the detached head
	 * @param {JSON} storage Storage of the repository
	 * @returns {Promise<String>} Name of the branch associated to the detached head
	 */
	async detachedBranchAsoociated(storage) {
		const idCurrentDetached = await currentHead(storage.commits).id;
		const firstCommit = await this.findFirstCommitAssociatedToDeteached(
			storage.commits,
			idCurrentDetached
		);
		const branch = await this.findBranchAssociatedToCommit(
			storage.commits,
			firstCommit.id
		);
		return branch;
	}
	/**
	 * @name findFirstCommitAssociatedToDeteached
	 * @memberof Branch#
	 * @method
	 * @description Find the first commit associated to the detached head
	 * @param {JSON[]} commits Array with the commits of the repository
	 * @param {String} id Id of the commit
	 * @returns {Promise<JSON>} Object with the commit associated to the detached head
	 */
	async findFirstCommitAssociatedToDeteached(commits, id) {
		const parent = commits.find((commit) => commit.id == id);
		if (!parent.class.includes("detached-head")) return parent;
		return await this.findFirstCommitAssociatedToDeteached(
			commits,
			parent.parent
		);
	}
	/**
	 * @name findBranchAssociatedToCommit
	 * @memberof Branch#
	 * @method
	 * @description Find the branch associated to the commit
	 * @param {JSON[]} commits Array with the commits of the repository
	 * @param {String} id Id of the commit
	 * @returns {Promise<String>} Name of the branch associated to the commit
	 */
	async findBranchAssociatedToCommit(commits, id) {
		const child = commits.find(
			(commit) => commit.parent == id && !commit.class.includes("detached-head")
		);
		if (child.tags.length > 0) return child.tags[0];
		return await this.findBranchAssociatedToCommit(commits, child.id);
	}
	/**
	 * @name callBackConfigList
	 * @memberof Branch#
	 * @callback callBackConfigList
	 * @description Call the method to create messages with the local branches of the repository and the remote branches
	 * @param {JSON} storage Storage of the repository
	 * @throws {Error} If the remote repository is not defined
	 * @returns {Promise<void>}
	 */
	callBackConfigAllBranch = async (storage) => {
		await this.callBackConfigList(storage);
		await this.callBackConfigRemoteBranch();
	};
	/**
	 * @name callBackConfigList
	 * @memberof Branch#
	 * @callback callBackConfigList
	 * @description Call the method to create messages with the local branches of the repository
	 * @param {JSON} storage Storage of the repository
	 * @returns {Promise<void>}
	 */
	callBackConfigList = async (storage) => {
		const headBranch = storage.information.head;
		const refRemote = this._remoteRepository?.split("-")[0] ?? "origin";
		const branches = (await findAllTags(storage.commits)).filter(
			(b) => !b.includes(refRemote)
		);
		for await (const branch of branches) {
			createMessage(
				this._logRepository,
				"info",
				branch == headBranch
					? `<p style="color:#49be25">*${headBranch}</p>`
					: `<p>${branch}</p>`
			);
		}
	};
	/**
	 * @name callBackConfigRemoteBranch
	 * @memberof Branch#
	 * @callback callBackConfigRemoteBranch
	 * @description Generate a message with the remote branches of the repository
	 * @throws {Error} If the remote repository is not defined
	 * @returns {Promise<void>}
	 */
	callBackConfigRemoteBranch = async () => {
		const storage = await getRepository(this._remoteRepository);
		if (!storage)
			throw ErrorModule(
				this._comand,
				"The remote repository is not defined",
				"The remote repository only exists in multi-user mode"
			);
		const branches = await findAllTags(storage.commits);
		const refRemote = this._remoteRepository.split("-")[0];
		for await (const branch of branches) {
			createMessage(this._logRepository, "info", refRemote + "/" + branch);
		}
	};
	/**
	 * @name callBackConfigDelete
	 * @memberof Branch#
	 * @callback callBackConfigDelete
	 * @description Callback to delete a branch in the repository
	 * @param {JSON} storage Storage of the repository
	 * @param {String[]} values Name of the branch to delete
	 * @throws {Error} If the name of the branch is empty
	 * @throws {Error} If the branch can not be deleted
	 * @throws {Error} If the branch does not exist
	 * @throws {Error} If the branch is the HEAD
	 * @returns {Promise<JSON>} Storage of the repository with the branch deleted
	 */
	callBackConfigDelete = async (storage, values) => {
		const branch = values[0];

		if (branch === "")
			throw new ErrorModule(
				this._comand,
				`The name '${branch}' of the branch is empty`,
				"Please, try again with a valid name"
			);

		if (
			branch === "master" ||
			branch === "HEAD" ||
			branch === storage.information.head
		)
			throw new ErrorModule(
				this._comand,
				`The branch can not be deleted ${branch}`,
				"Please use a different name"
			);

		const commitObj = storage.commits.find((commit) =>
			commit.tags.includes(branch)
		);

		if (!commitObj)
			throw new ErrorModule(
				this._comand,
				"The branch does not exist",
				"Please, try again with a valid name"
			);

		if (commitObj.tags.includes("HEAD"))
			throw new ErrorModule(
				this._comand,
				"The branch is the HEAD",
				"Please use a different name"
			);

		const childrens = await findAllChildrens(storage.commits, commitObj.id);
		const commitsWithoutBranch = await removeTagById(
			storage.commits,
			branch,
			commitObj.id
		);

		if (
			(childrens.some((commit) => !commit.class.includes("detached-head")) &&
				childrens.length > 0) ||
			commitObj.tags.length > 1
		) {
			storage.commits = commitsWithoutBranch;
			return storage;
		}

		storage.commits = deleteCommitsRecursivelyUntil(
			commitsWithoutBranch,
			commitObj,
			findAllExceptionCommitsToDelete(storage.commits)
		);

		return storage;
	};
	/**
	 * @name callBackCreateBranch
	 * @memberof Branch#
	 * @callback callBackCreateBranch
	 * @description Call the method to create a branch
	 * @param {JSON} storage Storage of the repository
	 * @param {String[]} values Name of the branch to create
	 * @throws {Error} If the name of the branch is empty
	 * @throws {Error} If the branch already exist
	 * @returns {Promise<JSON>} Storage of the repository with the new branch
	 */
	callBackCreateBranch = async (storage, values) => {
		const branch = values[0];
		if (branch === "")
			throw new ErrorModule(
				this._comand,
				`The name '${branch}' of the branch is empty`,
				"Please, try again with a valid name"
			);
		if (await existBranchOrEndPoint(storage.commits, branch))
			throw new ErrorModule(
				this._comand,
				`The branch already exist or name "${branch}" invalid`,
				"Please, use a different name"
			);
		const head = await currentHead(storage.commits);
		storage.commits = storage.commits.filter((commit) => commit.id !== head.id);
		head.tags.push(branch);
		storage.commits.push(head);
		if (head.class.includes("detached-head"))
			storage.commits = await changeDetachedCommitToCommit(
				head,
				storage.commits
			);
		return storage;
	};

	/**
	 * @name callBackConfigRename
	 * @memberof Branch#
	 * @callback callBackConfigRename
	 * @description Call the method to rename a branch
	 * @param {JSON} storage Storage of the repository
	 * @param {String[]} branchs Array with the name of the branch and the new name
	 * @throws {Error} If the command is not valid
	 * @returns {Promise<JSON>} Storage of the repository with the branch renamed
	 */
	callBackConfigRename = async (storage, [name, newName]) => {
		if (!name) throw new Error("The command is not valid");

		if (!newName) {
			newName = name;
			name = storage.information.head.includes("detached")
				? await this.detachedBranchAsoociated(storage)
				: storage.information.head;
		}

		storage.commits = await Promise.all(
			storage.commits.map(async (commit) => {
				if (commit.tags.includes(name))
					commit.tags = await Promise.all(
						commit.tags.map(async (tag) => (tag === name ? newName : tag))
					);
				return commit;
			})
		);

		if (storage.information.head === name) storage.information.head = newName;

		return storage;
	};
	/**
	 * @name callbackHelp
	 * @memberof Branch#
	 * @callback callbackHelp
	 * @description Create a message with the help of the comand
	 */
	callbackHelp = async () => {
		const message = `
        <h5>Concept</h5>
        <p class="help">List, create, or delete branches
        <h5>Syntax</h5>
        <p class="help">git branch [ (-a | --all) | (-r | --remote) | (-l | --list) ]</p>
        <p class="help">git branch [(-d | --delete)] &lt;branch-name&gt;</p>
        <p class="help">git branch (-m | --move) [&lt;branch-name&gt;] &lt;new-branch-name&gt;</p>
        <h5>Configurations</h5>
        <ul>
            <li><p class="help">-a, --all &nbsp;&nbsp;&nbsp;List all branches</p></li>
            <li><p class="help">-r, --remote&nbsp;&nbsp;&nbsp;List remote branches</p> </li>
            <li><p class="help">-l, --list&nbsp;&nbsp;&nbsp;List local branches</p> </li>
            <li><p class="help">-d, --delete&nbsp;&nbsp;&nbsp;Delete a branch</p> </li>
            <li><p class="help">-m, --move&nbsp;&nbsp;&nbsp;Rename a branch</p> </li>
        </ul>`;
		createMessage(this._logRepository, "info", message);
	};
}

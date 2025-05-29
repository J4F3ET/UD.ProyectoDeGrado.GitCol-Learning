import {
	createMessage,
	findCommitsDiffBetweenRepositories,
	getRepository,
	resolveCreateMergeRegister,
	resolveMovilityTagInMerge,
	findAllTags,
	findAllParents,
	mergeChangesInRepositories,
	implementTagsRemotesInRepository,
	resolveIsHeadNull,
	findCommitsChangeWithTags,
	findCommitsHead,
	changeDetachedCommitToCommit,
} from "./utils.js";
import {
	ErrorModule,
	errorNotInitialized,
	errorCommitNotFound,
} from "./error.js";
/**
 * @class
 * @classdesc The pull command is used to fetch from and integrate with another repository or a local branch'
 */
export class Pull {
	_comand = "pull";
	/**
	 * @typedef {Object} _configurationsOfPull
	 * @property {Object<Boolean,Function>} q Quiet, only print error and warning messages; all other output will be suppressed.
	 * @property {Boolean} q.quiet Indicate that the quiet option was used. Default is false
	 * @property {Function} q.callback Callback to set the quiet option to true
	 * @property {Object<Function>} h Help of the command. The property is the similitude with Git. [-h | --help]
	 * @property {Function} h.callback Callback do responsability of generate a message in the console. With items as the concept, syntax and configurations.
	 * @alias _configurations
	 * @readonly
	 * @memberof! Pull#
	 */
	_configurations = {
		h: {
			callback: async () => this.callbackHelp(),
		},
		q: {
			quiet: false,
			callback: async () => (this._configurations.q.quiet = true),
		},
	};
	/**
	 * @type {string}
	 * @description Name of the repository
	 * @default 'repository'
	 * @memberof! Pull#
	 * @readonly
	 */
	_dataRepository = "repository";
	/**
	 * @type {string}
	 * @description Name of the log repository
	 * @default 'log'
	 * @memberof! Pull#
	 * @readonly
	 */
	_logRepository = "log";
	/**
	 * @type {string}
	 * @description Name of the remote repository
	 * @default 'origin-'
	 * @memberof! Pull#
	 */
	_remoteRepository = "origin-";
	/**
	 * @constructor
	 * @param {string} dataRepository Name of the space where the repository will be saved
	 * @param {string} logRepository Name of the space where the log will be saved
	 * @description Create a new instance of Pull
	 */
	constructor(dataRepository, logRepository, remoteRepository) {
		this._dataRepository = dataRepository;
		this._logRepository = logRepository;
		this._remoteRepository = remoteRepository;
	}
	/**
	 * @name execute
	 * @description Execute the command
	 * @method
	 * @param {string[]} dataComand
	 * @throws {Error}
	 * @memberof! Pull#
	 */
	async execute(dataComand) {
		const remoteRepository = await getRepository(this._remoteRepository);
		const localRepository = await getRepository(this._dataRepository);

		this.resetConfiguration();

		if (!remoteRepository || !localRepository)
			throw errorNotInitialized(this._comand);

		const refRemote = this._remoteRepository.split("-")[0];

		let {repositoryFetch, errFetch} = await this.fetch(
			dataComand[dataComand.length - 1],
			refRemote,
			localRepository,
			remoteRepository
		);
		if (errFetch instanceof Error) throw errFetch;

		if (errFetch != null)
			return createMessage(this._logRepository, "info", errFetch);

		const {repositoryMerge, errMerge} = await this.merge(
			refRemote,
			dataComand,
			repositoryFetch
		);

		if (errMerge instanceof Error) throw errMerge;

		if (errMerge != null)
			return createMessage(this._logRepository, "info", errMerge);

		sessionStorage.setItem(
			this._dataRepository,
			JSON.stringify(repositoryMerge)
		);
		console.timeEnd("Execution time of commit");
	}

	async fetch(
		tagByDataCommand = "master",
		refRemote,
		localRepository,
		remoteRepository
	) {
		const commitsDiff = await findCommitsDiffBetweenRepositories(
			localRepository.commits,
			remoteRepository.commits
		);
		const headsLocal = await findCommitsHead(
			localRepository.commits,
			refRemote
		);
		const headsRemote = await findCommitsHead(remoteRepository.commits);
		const headsDiff = headsRemote.difference(headsLocal);

		if (!commitsDiff.length && !headsDiff.size)
			return {repositoryFetch: null, errFetch: "Already up to date."};

		try {
			if (!commitsDiff.length && headsDiff.size)
				localRepository.commits = await implementTagsRemotesInRepository(
					refRemote,
					headsRemote,
					await findCommitsChangeWithTags(remoteRepository.commits, headsDiff),
					localRepository.commits
				);
			else
				localRepository.commits = await implementTagsRemotesInRepository(
					refRemote,
					headsRemote,
					...Object.values(
						await mergeChangesInRepositories(
							localRepository.commits,
							remoteRepository.commits
						)
					)
				);

			if (!localRepository.information.head)
				return {
					repositoryFetch: await resolveIsHeadNull(
						localRepository,
						tagByDataCommand
					),
					errFetch: null,
				};
			return {repositoryFetch: localRepository, err: null};
		} catch (error) {
			return {
				repositoryFetch: null,
				errFetch: new ErrorModule(
					this._comand,
					error.message,
					`Please, try again using the command 'git pull <remote> <branch>'. By more information use the command 'git pull -h'`
				),
			};
		}
	}

	async merge(refRemote, dataComand, localRepository) {
		const tagsLocalRepository = new Set(
			await findAllTags(localRepository.commits)
		);
		const tagsLocalRepositoryWithoutReference = new Set();
		const refBranchLocalPull =
			dataComand[dataComand.length - 1] ??
			(localRepository.information.head.includes("detached")
				? null
				: localRepository.information.head) ??
			"master";
		const refBranchRemotePull = refRemote + "/" + refBranchLocalPull;

		tagsLocalRepository.forEach((tag) => {
			if (tag.includes(refRemote)) return;
			tagsLocalRepositoryWithoutReference.add(tag);
		});
		try {
			if (!tagsLocalRepository.has(refBranchRemotePull))
				throw ErrorModule(
					this._comand,
					`fatal merge: couldn't find remote ref "${refBranchRemotePull}"`,
					`Please, try again using the command 'git branch -a' to see the branches of the repository is necessary the remote branch`
				);

			if (
				!tagsLocalRepository.has(refBranchLocalPull) &&
				tagsLocalRepositoryWithoutReference.size
			) {
				throw ErrorModule(
					this._comand,
					`fatal merge: couldn't find local ref "${refBranchLocalPull}"`,
					`Please, try again using the command 'git branch -a' to see the branches of the repository is necessary the local branch`
				);
			}

			const commitRemotePull = localRepository.commits.find((c) =>
				c.tags.includes(refBranchRemotePull)
			);

			if (!commitRemotePull)
				throw errorCommitNotFound(this._comand, refBranchRemotePull);

			let commitLocalPull = localRepository.commits.find((c) =>
				c.tags.includes(refBranchLocalPull)
			);
			if (
				!tagsLocalRepository.has(refBranchLocalPull) &&
				!tagsLocalRepositoryWithoutReference.size
			) {
				return {
					repositoryMerge: await this.especialCase(
						localRepository,
						refBranchLocalPull,
						commitRemotePull
					),
					errMerge: null,
				};
			}

			const parentsCommitRemotePull = new Set(
				await Promise.all(
					(
						await findAllParents(localRepository.commits, commitRemotePull)
					).map(async (commit) => commit.id)
				)
			);

			const parentscommitLocalPull = new Set(
				await Promise.all(
					(
						await findAllParents(localRepository.commits, commitLocalPull)
					).map(async (commit) => commit.id)
				)
			);

			if (parentscommitLocalPull.has(commitRemotePull.id))
				return {repositoryMerge: null, errMerge: "Already up to date."};

			const functionCase = parentsCommitRemotePull.has(commitLocalPull.id)
				? resolveMovilityTagInMerge
				: resolveCreateMergeRegister;

			return {
				repositoryMerge: await functionCase(
					localRepository,
					commitRemotePull,
					commitLocalPull
				),
				errMerge: null,
			};
		} catch (error) {
			return {repositoryMerge: null, errMerge: error};
		}
	}

	async especialCase(localRepository, tagHead, commitHead) {
		localRepository.information.head = tagHead;
		commitHead.tags.push(tagHead);
		localRepository.commits = await changeDetachedCommitToCommit(
			commitHead,
			localRepository.commits
		);
		return localRepository;
	}

	/**
	 * @memberof Pull#
	 * @name resolveConfiguration
	 * @method
	 * @description Resolve the configurations of the merge
	 * @param {string[]} dataComand
	 */
	async resolveConfiguration(dataComand) {
		if (dataComand.includes("-h")) this._configurations.h.callback();
		if (dataComand.includes("-q")) this._configurations.q.callback();
	}
	resetConfiguration = async () => {
		this._configurations.q.quiet = false;
	};
	/**
	 * @name callBackHelp
	 * @description Callback to the help of the command
	 * @memberof! Pull#
	 * @callback callBackHelp
	 * @return {Promise<Boolean>}
	 */
	callbackHelp = async () => {
		createMessage(
			this._logRepository,
			"info",
			`
            The pull command is used to fetch from and integrate with another repository or a local branch'
            'pull [options] [<repository> [<refspec>…​]]`
		);
		return false;
	};
}

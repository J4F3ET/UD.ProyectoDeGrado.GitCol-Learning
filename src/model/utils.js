process.loadEnvFile();

const {
	GOOGLE_APPLICATION_CREDENTIALS: firebaseConfig = "",
	FIREBASE_DATABASE_URL: databaseURL = "",
} = process.env;

export const envConfig = {
	firebaseConfig,
	databaseURL,
};

export const defaultRepository = async (key) => {
	return {
		commits: [],
		information: {
			head: null,
			repository: `origin${key}`,
		},
	};
};
export async function parseToCommitObject(data) {
	return {
		id: data.id || "",
		message: data.message || "",
		parent: data.parent || "",
		unions: data.unions || [],
		tags: data.tags || [],
		class: data.class || ["commit"],
		autor: data.hasOwnProperty("autor") ? data.autor : null,
		date: data.date || "",
		cx: data.cx || 0,
		cy: data.cy || 0,
	};
}
export async function parseToRoomObject(key, data) {
	if (data.repository.hasOwnProperty("commits"))
		data.repository.commits = await Promise.all(
			data.repository.commits.map(parseToCommitObject)
		);

	const repository = data.repository.hasOwnProperty("commits")
		? data.repository
		: defaultRepository(key);
	return {
		code: data.code || "",
		description: data.description || "",
		owner: data.owner || "",
		members: data.members || [],
		status: data.status || true,
		repository: await repository,
		hidden: data.hidden || false,
	};
}

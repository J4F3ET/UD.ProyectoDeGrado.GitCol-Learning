import { database, auth } from "./firebase-service.js";
const path = "users/";

export const getUserByEmail = async (email) => {
	try {
		const snapshot = await database
			.ref(path)
			.orderByChild("email")
			.equalTo(email)
			.once("value");

		if (!snapshot.val()) {
			return { err: false, key: null, data: null };
		}
		const user = Object.values(snapshot.val())[0];
		const key = Object.keys(snapshot.val())[0];
		return { err: false, key: key, data: user };
	} catch (error) {
		const existsUserRef = await verifyExistRefUser();
		if (existsUserRef.err) return { err: true, data: error };
		if (!existsUserRef.data) return { err: false, key: null, data: null };
		console.error("GETUSERBYEMAIL", error.message);
		return { err: true, data: error };
	}
};
export const userLogin = async (uid, token) => {
	if (!token || token == "") return { err: true, data: null };
	let payload, userAuth;
	try {
		userAuth = await auth.getUser(uid);
		payload = await auth.verifyIdToken(token);
	} catch (error) {
		return { err: true, data: error };
	}
	if (!userAuth) return { err: true, data: new Error("User not found") };
	if (!payload) return { err: true, data: new Error("Invalid access token") };

	const { err, data: user } = await getUserByAuthUid(payload.uid);

	if (err) return { err: true, data: new Error("User not found") };
	if (!user) {
		const {err,data} = await firstLogin(userAuth)
		if (err || !data) return { err: true, data: new Error("User not found") };
		if (!data.user.email) return { err: true, data: new Error("Email not found") };
		return { err: false, data: data.user };
	}
	if (!user.email) return { err: true, data: new Error("Email not found") };

	if (!user.providers || user.providers.length === 0)
		return { err: true, data: new Error("Provider not found") };

	const providerInUser = user.providers?.find(
		(provider) => userAuth.providerData[0]?.uid === provider.providerUid
	);

	if (!providerInUser)
		return { err: true, data: new Error("Provider not found") };

	if (providerInUser.userUid !== userAuth.uid)
		return { err: true, data: new Error("User not found") };

	const potentialUser = await completedUser(userAuth, user);
	const existsChanged = await hasChangedUser(potentialUser, {
		email: user.email,
		name: user.name,
		providers: user.providers,
	});
	if (existsChanged) return await updateUser(user.key, potentialUser);

	return { err: false, data: user };
};
const firstLogin = async (user) => {
	if (!user) return { err: true, data: new Error("User not found") };
	return createUser(await completedUser(user, {}));
};
const createUser = async (user) => {
	try {
		const key = await database.ref(path).push(user);
		return { err: false, data: { key, user } };
	} catch (error) {
		console.error("CREATEUSER", error);
		return { err: true, data: error };
	}
};
export const getUser = async (key) => {
	try {
		const dataSnapshot = database.ref(path + key).once("value");
		return { err: false, data: dataSnapshot.val() };
	} catch (error) {
		console.error("GETUSER", error);
		return { err: true, data: error };
	}
};
const updateUser = async (key, user) => {
	try {
		await database.ref(path + key).update(user);
		return { err: false, data: user };
	} catch (error) {
		console.error("UPDATEUSER", error);
		return { err: true, data: error };
	}
};
export const desactiveUser = async (key) => {
	try {
		await database.ref(path + key + "/status").update(false);
	} catch (error) {
		console.error("DESACTIVEUSER", error);
		return { err: true, data: error };
	}
};
const verifyExistRefUser = async () => {
	try {
		const existsUserRef = await database.ref(path).once("value");
		return { err: false, data: existsUserRef.exists() };
	} catch (error) {
		console.error("VERIFYEXISTREFUSER", error);
		return { err: true, data: error };
	}
};
const parseProvider = (objectAuth, uid) => {
	return {
		userUid: uid,
		providerId: objectAuth.providerId,
		providerUid: objectAuth.uid,
	};
};
const hasChangedUser = async (newUser, oldUser) => {
	if (!oldUser) return true;
	const keysNewUser = Object.keys(newUser);
	const keysOldUser = Object.keys(oldUser);
	for (let i = 0; i < keysNewUser.length; i++) {
		if (keysNewUser[i] !== keysOldUser[i]) return true;
		if (newUser[keysNewUser[i]] !== oldUser[keysOldUser[i]]) return true;
	}
	return false;
};
const completedUser = async (objectAuth, objectDB) => {
	const providerAuth = objectAuth.providerData[0];
	const providesBD = objectDB?.providers ?? [];
	const email = objectDB?.email ?? findEmailInAuthObject(objectAuth);
	const name =
		objectDB?.name ??
		objectAuth.displayName ??
		objectAuth.providerData[0]?.displayName ??
		null;
	const provider = parseProvider(providerAuth, objectAuth.uid);
	if (!objectDB) return { email, name, providers: [provider] };
	if (!providesBD.flatMap((p) => p.providerId).includes(provider.providerId)) {
		return { email, name, providers: providesBD.concat(provider) };
	}
	return { email, name, providers: providesBD };
};
const findEmailInAuthObject = (objectAuth) => {
	return objectAuth.email ?? objectAuth.providerData[0]?.email ?? null;
};
export const getUserByAuthUid = async (uid) => {
	try {
		const snapshot = await database
			.ref(path)
			.orderByChild("providers")
			.once("value");

		const users = snapshot.val();
		if (!users) return { err: true, data: null };
		console.log("sas")
		const { err, data } = await callbackFindUserByProviderUid(uid, users);
		if (err || err == null || !data) return { err, data };
		return { err: false, data };
	} catch (error) {
		console.error("GETUSERBYAUTHUID", error);
		return { err: true, data: error };
	}
};
const callbackFindUserByProviderUid = async (uid, users) => {
	for await (const [key, value] of Object.entries(users)) {
		const providers = value.providers;
		const user = await findUser(providers, uid);
		if (user) return { err: false, data: { key, ...value } };
	}
	return { err: false, data: null};
};
const findUser = async (providers, uid) => {
	return providers.find((provider) => provider.userUid === uid) ?? null;
};
export const updateEmail = async (token, email) => {
	if (!token || token == "") return { err: true, data: null };
	let payload;
	try {
		payload = await auth.verifyIdToken(token);
	} catch (error) {
		return { err: true, data: error };
	}
	if (!payload) return { err: true, data: new Error("Invalid access token") };

	const { err, data: user } = await getUserByAuthUid(payload.uid);
	if (err) return { err: true, data: new Error("User not found") };
	if (!user) return { err: true, data: new Error("User not found") };

	const updatedUser = { ...user, email };
	return updateUser(user.key, updatedUser);
};

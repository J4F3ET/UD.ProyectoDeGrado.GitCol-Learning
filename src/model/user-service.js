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
export const userLogin = async (uid, newEmail) => {
	if (!uid || uid == "") return { err: true, data: null };
	try {
		const userAuth = await auth.getUser(uid);

		if (!userAuth) return { err: true, data: new Error("User not found") };

		const email = findEmailInAuthObject(userAuth) ?? newEmail;
		if (!email) return { err: true, data: new Error("Email not found") };

		const userResponse = await getUserByEmail(email);

		if (userResponse.err)
			return { err: true, data: new Error("User not found") };

		if (!userResponse.data) return firstLogin(uid);

		const uidProviderData = userAuth.providerData[0]?.uid;

		const providerInUser = userResponse.data?.providers?.find(
			(provider) => uidProviderData === provider.providerUid
		);
		if (!providerInUser)
			return { err: true, data: new Error("Provider not found") };

		if (providerInUser.userUid !== userAuth.uid)
			return { err: true, data: new Error("User not found") };
		
		if (!userResponse.key)
			return { err: true, data: new Error("User not found") };

		const potentialUser = await completedUser(userAuth, userResponse.data);
		const existsChanged = await hasChangedUser(
			potentialUser,
			userResponse.data
		);
		if (existsChanged) return await updateUser(userResponse.key, potentialUser);

		return { err: false, data: userResponse.data };
	} catch (error) {
		console.error("USERLOGIN", error);
		return { err: true, data: error };
	}
};
const firstLogin = async (uid) => {
	const data = await auth.getUser(uid);
	if (!data) return { err: true, data: new Error("User not found") };
	return createUser(await completedUser(data, {}));
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
		if (!snapshot.val()) return { err: true, data: null };
		const { err, data } = await callbackFindUserByProviderUid(
			uid,
			snapshot.val()
		);
		if (!err) return { err: false, data };
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
	return null;
};
const findUser = async (providers, uid) => {
	return providers.find((provider) => provider.userUid === uid) ?? null;
};

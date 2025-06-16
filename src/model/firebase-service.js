import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getDatabase} from "firebase-admin/database";
import {getAuth} from "firebase-admin/auth";
import {envConfig} from "./utils.js";

const app = initializeApp({
	credential: applicationDefault(),
	databaseURL: envConfig.databaseURL
});
export const auth = getAuth(app);
export const database = getDatabase(app);


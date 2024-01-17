import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getDatabase} from "firebase-admin/database";
import {getAuth} from "firebase-admin/auth";
import * as dotenv from "dotenv";
dotenv.config();
const app = initializeApp({
	credential: applicationDefault(),
	databaseURL: "https://gitcol-learning-default-rtdb.firebaseio.com"
});
export const auth = getAuth(app);
export const database = getDatabase(app);


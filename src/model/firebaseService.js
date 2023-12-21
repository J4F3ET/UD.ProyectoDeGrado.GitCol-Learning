import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getDatabase} from "firebase-admin/database";
import {getAuth} from "firebase-admin/auth";
// Firebase
const app = initializeApp({
	credential: applicationDefault(),
	databaseURL: "https://gitcol-learning-default-rtdb.firebaseio.com",
});
export const database = getDatabase(app);
export const auth = getAuth(app);

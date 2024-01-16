import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getDatabase} from "firebase-admin/database";
import {getAuth} from "firebase-admin/auth";
// Firebase
const app = initializeApp({
	credential: applicationDefault(),
	projectId: "gitcol-learning",
	databaseURL: "https://gitcol-learning-default-rtdb.firebaseio.com",
}, "gitcol-learning");
export const auth = getAuth(app);
export const database = getDatabase(app);


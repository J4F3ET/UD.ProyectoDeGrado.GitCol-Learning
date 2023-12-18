import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getDatabase} from "firebase-admin/database";
// Firebase
initializeApp({
	credential: applicationDefault(),
	databaseURL: "https://gitcol-learning-default-rtdb.firebaseio.com",
});
const database = getDatabase();

module.exports = {database};

import {
	getAuth,
	GoogleAuthProvider,
	GithubAuthProvider,
	OAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
const firebaseConfig = {
	apiKey: "AIzaSyAkCtlBOfggn5B1ExluCRr43YwPbnUTu0s",
	authDomain: "gitcol-learning.firebaseapp.com",
	databaseURL: "https://gitcol-learning-default-rtdb.firebaseio.com",
	projectId: "gitcol-learning",
	storageBucket: "gitcol-learning.firebasestorage.app",
	messagingSenderId: "614262624756",
	appId: "1:614262624756:web:9c0cb932ddb3104c3ca9a1",
	measurementId: "G-TX33MTXQN4",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
export const microsoftAuthProvider = new OAuthProvider("microsoft.com");

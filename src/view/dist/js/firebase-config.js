import {
	getAuth,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
const firebaseConfig = {
	apiKey: "AIzaSyAkCtlBOfggn5B1ExluCRr43YwPbnUTu0s",
	authDomain: "gitcol-learning.firebaseapp.com",
	databaseURL: "https://gitcol-learning-default-rtdb.firebaseio.com",
	projectId: "gitcol-learning",
	storageBucket: "gitcol-learning.appspot.com",
	messagingSenderId: "614262624756",
	appId: "1:614262624756:web:9c0cb932ddb3104c3ca9a1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
	getAuth,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
const firebaseConfig = {
	apiKey: "AIzaSyAkCtlBOfggn5B1ExluCRr43YwPbnUTu0s",
	authDomain: "gitcol-learning.firebaseapp.com",
	databaseURL: "https://gitcol-learning-default-rtdb.firebaseio.com",
	projectId: "gitcol-learning",
	storageBucket: "gitcol-learning.appspot.com",
	messagingSenderId: "614262624756",
	appId: "1:614262624756:web:d04a12efe26955d13ca9a1"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
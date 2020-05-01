import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAjaWoFEJ49khltVojcuEjgTSHXrMODptI",
	authDomain: "messenger-app-9e350.firebaseapp.com",
	databaseURL: "https://messenger-app-9e350.firebaseio.com",
	projectId: "messenger-app-9e350",
	storageBucket: "messenger-app-9e350.appspot.com",
	messagingSenderId: "820968672244",
	appId: "1:820968672244:web:3646985195957ad99e07a1",
	measurementId: "G-XHFW33K765",
};

firebase.initializeApp(firebaseConfig);

export default firebase;

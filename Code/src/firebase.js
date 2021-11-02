import firebase from "firebase";

/*Initialize app. Code provided from firebase*/
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAh-OCWnu2Gfo_zSA5l0dfbaN05CypGuNU",
  authDomain: "sas-4946f.firebaseapp.com",
  projectId: "sas-4946f",
  storageBucket: "sas-4946f.appspot.com",
  messagingSenderId: "49566155519",
  appId: "1:49566155519:web:ecda45fb9ee41b08ce82ca",
  measurementId: "G-WQBB84P0V7",
});

const db = firebaseApp.firestore(); /*access the db*/
const auth =
  firebase.auth(); /*for authentication, create users, login, logout*/
const storage =
  firebase.storage(); /* for uploading pictures to firebase and storing in db */

export { db, auth, storage };

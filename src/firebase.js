// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOZSJ9sbYzGQwIOvxFo-uFBD_zDVHX5h8",
  authDomain: "chatapp-68c91.firebaseapp.com",
  projectId: "chatapp-68c91",
  storageBucket: "chatapp-68c91.appspot.com",
  messagingSenderId: "407899110666",
  appId: "1:407899110666:web:3c3dd8d114320925b40ef3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth , app}
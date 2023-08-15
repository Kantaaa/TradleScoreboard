// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // <-- Make sure to import this

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkwLzJqmYHQMArMGQ0rIIk4UlBxs28IYs",
  authDomain: "tradlescoreboard.firebaseapp.com",
  databaseURL: "https://tradlescoreboard-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tradlescoreboard",
  storageBucket: "tradlescoreboard.appspot.com",
  messagingSenderId: "251417363256",
  appId: "1:251417363256:web:d0a9871597d088be36b7cd",
  measurementId: "G-X3VS1P0JGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };


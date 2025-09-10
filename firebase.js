import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDR1VXmIFaqqOQSTiipxNFRN347uU1FKiw",
  authDomain: "tribal-radar-423706-s5.firebaseapp.com",
  projectId: "tribal-radar-423706-s5",
  storageBucket: "tribal-radar-423706-s5.appspot.com", // ✅ fixed
  messagingSenderId: "899327975381",
  appId: "1:899327975381:web:d3c9fb0240fb577f8fe75c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

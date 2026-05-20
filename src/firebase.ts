import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVNm3JmJJYqs4c8lkAfSZmovIf8sDbDm0",
  authDomain: "cconnect-4ff0b.firebaseapp.com",
  projectId: "cconnect-4ff0b",
  storageBucket: "cconnect-4ff0b.firebasestorage.app",
  messagingSenderId: "845439431178",
  appId: "1:845439431178:web:26743dd4eb2691074865f3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
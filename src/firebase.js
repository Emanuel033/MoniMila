import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBy7L7G2HZ5bihSZ-6YGe-YBL9mF2I9HyU",
  authDomain: "monimilabakery.firebaseapp.com",
  projectId: "monimilabakery",
  storageBucket: "monimilabakery.firebasestorage.app",
  messagingSenderId: "155666898109",
  appId: "1:155666898109:web:544fbfff4ebd6b99c06bd4",
  measurementId: "G-FDLBLJREDW"
};

// Aquí encendemos la maquinaria de Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwmIjwvDEva0VmUNnZAfhNXQITv433Wk0",
  authDomain: "cse3mad-finalapp.firebaseapp.com",
  projectId: "cse3mad-finalapp",
  storageBucket: "cse3mad-finalapp.firebasestorage.app",
  messagingSenderId: "454741062489",
  appId: "1:454741062489:web:179fc1e7492e6fe6371248",
  measurementId: "G-LCNGQBZEQP",
};
module.exports = { firebaseConfig };

import { initializeApp } from "firebase/app";
import {
    createUserWithEmailAndPassword,
    deleteUser, getAuth, signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { addDoc, collection } from "firebase/firestore";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

//wrappers
export const addDebugDoc = (data: any) => {
  return addDoc(collection(db, "Debug"), data);
};
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const createAccount = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const removeUser = (user: any) => deleteUser(user);

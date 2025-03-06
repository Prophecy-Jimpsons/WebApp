// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDC9hJBtnxX93ceQ6FbMNBFs7aRM4ZKnf0",
  authDomain: "dao-voting-e3357.firebaseapp.com",
  projectId: "dao-voting-e3357",
  storageBucket: "dao-voting-e3357.firebasestorage.app",
  messagingSenderId: "398053905439",
  appId: "1:398053905439:web:efbbef470d7c19cb2b312a",
  measurementId: "G-X3BXK7XTWL",
  databaseURL: "https://dao-voting-e3357-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "dao-voting-e3357");
export const database = getDatabase(app);

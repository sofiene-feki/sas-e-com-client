import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEzRHJixuGSGSp8vWlPArphiviGjpOZh8",
  authDomain: "artisanatbargaoui-f9611.firebaseapp.com",
  projectId: "artisanatbargaoui-f9611",
  storageBucket: "artisanatbargaoui-f9611.firebasestorage.app",
  messagingSenderId: "505197472720",
  appId: "1:505197472720:web:18da3b2e08df3b7e9927d5",
  measurementId: "G-B5VXZ5T0QC",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAT5o9FpRc6cWFW9oPdYrFJHEU-pIHjbH4",
  authDomain: "ivy-auction.firebaseapp.com",
  projectId: "ivy-auction",
  storageBucket: "ivy-auction.firebasestorage.app",
  messagingSenderId: "1079698381099",
  appId: "1:1079698381099:web:9ea830e4b4f1fdafcc4d6e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

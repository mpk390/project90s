// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDn9U1YjKKQ-NpQiFc5c77E62KPEYV9vxc",
  authDomain: "project-90-s-game.firebaseapp.com",
  projectId: "project-90-s-game",
  storageBucket: "project-90-s-game.firebasestorage.app",
  messagingSenderId: "568431803770",
  appId: "1:568431803770:web:1ccb4c542a9d962a94aac3",
  measurementId: "G-GF8BCFC1J9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

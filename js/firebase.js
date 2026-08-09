import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnRy5clvnT9BotnAqeOMc7Ss7cZcIFhkY",
  authDomain: "ai-helpdesk-a3d4a.firebaseapp.com",
  projectId: "ai-helpdesk-a3d4a",
  storageBucket: "ai-helpdesk-a3d4a.firebasestorage.app",
  messagingSenderId: "84638747687",
  appId: "1:84638747687:web:429eb4cbceecceb09e5202",
  measurementId: "G-P6ES16TR37"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
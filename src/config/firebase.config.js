import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyCFg-rfmJF6buDY9ysi0aGLMo928UqNEQs",
  authDomain: "team11-messenger.firebaseapp.com",
  projectId: "team11-messenger",
  storageBucket: "team11-messenger.appspot.com",
  messagingSenderId: "466572700439",
  appId: "1:466572700439:web:f473e7ea9898ed9090a552",
  databaseURL: "https://team11-messenger-default-rtdb.europe-west1.firebasedatabase.app/",
};

export const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app);
export const db = getDatabase(app);
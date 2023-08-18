// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBdFCwj8OD896W6vHSv7flAl2499rI4H3M',
  authDomain: 'haws-v2.firebaseapp.com',
  projectId: 'haws-v2',
  storageBucket: 'haws-v2.appspot.com',
  messagingSenderId: '229244676682',
  appId: '1:229244676682:web:a4a87ff9d49ff7cb1a14b3',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();
// To apply the default browser preference instead of explicitly setting it.
auth.useDeviceLanguage();


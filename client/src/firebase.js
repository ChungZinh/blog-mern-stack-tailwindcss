// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyAUtDkyz_lwgDBKxU7VKXB-aGS8j9Qsf4U",
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: "blog-dev-ec26e.firebaseapp.com",
  projectId: "blog-dev-ec26e",
  storageBucket: "blog-dev-ec26e.appspot.com",
  messagingSenderId: "51510078406",
  appId: "1:51510078406:web:5f96d93da6f89e9f93e0c7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

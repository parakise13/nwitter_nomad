import * as firebase from "firebase/app";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// firebase의 무언가를 사용하기 위해서는 항상 import 해줘야함

import "firebase/auth";

// Your web app's Firebase configuration
// 하기의 key들은 .env에 따로 정의해주고 .env는 gitignore에 넣어 commit 되지 않게해서 key가 다른 사람들에게 공개되지 않도록함
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// initializeApp(firebaseConfig);

// export const authService = getAuth();

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
export const authService = firebase.auth();

import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

export default {
  database,
  getKey: () => database.ref().push().key,
  save: (key, value) => database.ref(key).update(value),
  subscribe: (key, event, func) => database.ref(key).on(event, func),
};

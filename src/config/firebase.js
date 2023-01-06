import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDidAMx4HliM2O59gXfNNuT3fEhR4uSUrk",
  authDomain: "paola-alcantara.firebaseapp.com",
  projectId: "paola-alcantara",
  storageBucket: "paola-alcantara.appspot.com",
  messagingSenderId: "352715294814",
  appId: "1:352715294814:web:9ff800e9db10ff15504ccf",
  measurementId: "G-WEY4RLFD7L"
};

const fireDb = firebase.initializeApp(firebaseConfig);
export default fireDb.database().ref();

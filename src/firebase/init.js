import firebase from 'firebase'
import firestore from 'firebase/firestore'



var firebaseConfig = {
    apiKey: "AIzaSyBEgR1YOJ70ztWVi--AT17hl05wxqyWSLI",
    authDomain: "improved-b59aa.firebaseapp.com",
    databaseURL: "https://improved-b59aa.firebaseio.com",
    projectId: "improved-b59aa",
    storageBucket: "improved-b59aa.appspot.com",
    messagingSenderId: "803880492147",
    appId: "1:803880492147:web:7ff4a7292a638d3f"
  };
  // Initialize Firebase


  var database=firebase.initializeApp(firebaseConfig);

  export default database.firestore()
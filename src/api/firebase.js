import * as firebase from 'firebase';
import 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyAPBc8WhAKQ6ZFuF-mpHgMZSh8xHM38KpQ',
    authDomain: 'apiapi-orbital.firebaseapp.com',
    databaseURL: 'https://apiapi-orbital.firebaseio.com',
    projectId: 'apiapi-orbital',
    storageBucket: '',
    messagingSenderId: '986424330236',
    appId: '1:986424330236:web:45906bd86915dee4'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make references to be exported
const auth = firebase.auth();
const db = firebase.firestore();
const GeoPoint = firebase.firestore.GeoPoint;
const FieldValue = firebase.firestore.FieldValue;

export { auth, db, GeoPoint, FieldValue };

import * as firebase from 'firebase';

const Constants = {
  eventTypes : ['Eatings', 'Drinkings', 'Movies', 'Sports', 'Casino', 'Others'],
  numbers : Array.apply(null, {length: 1000}).map(Number.call, Number),
  firebaseApp : firebase.initializeApp({
    apiKey: "AIzaSyA8G1jarjew06jjORJf7nA3DBvb0ks56LE",
    authDomain: "blink-b568e.firebaseapp.com",
    databaseURL: "https://blink-b568e.firebaseio.com",
    storageBucket: "blink-b568e.appspot.com",
    messagingSenderId: "600861396413"
  })
}

export default Constants;

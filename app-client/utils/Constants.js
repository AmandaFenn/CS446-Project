import * as firebase from 'firebase';

const Constants = {
  eventTypes : ['Eatings', 'Drinkings', 'Movies', 'Sports', 'Casino', 'Others'],
  numbers : Array.apply(null, {length: 1000}).map(Number.call, Number),
  messages: [' has requested to join your event ',
             ' has accepted your invitation to the event ',
             ' has left your event ',
             'You have been invited to the event ',
             'You have been removed from the event ',
             'Your request to join the event ',
             ' has been declined',
             'Your have been approved to join the event '],
  AndroidTabIcons : {'Events': require('../img/Restaurant.png'),
                     'Notifications': require('../img/Info.png'),
                     'Settings' : require('../img/Settings.png')},
  firebaseApp : firebase.initializeApp({
    apiKey: "AIzaSyA8G1jarjew06jjORJf7nA3DBvb0ks56LE",
    authDomain: "blink-b568e.firebaseapp.com",
    databaseURL: "https://blink-b568e.firebaseio.com",
    storageBucket: "blink-b568e.appspot.com",
    messagingSenderId: "600861396413"
  }),
  ImagePickerOptions : {
    title: 'Upload a photo',
    customButtons: [
      {name: 'fb', title: 'Remove the photo'},
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  },
  fbIcon : 'https://en.facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-logo.png'
}

export default Constants;

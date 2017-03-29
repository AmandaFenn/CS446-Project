import * as firebase from 'firebase';

const Constants = {
  eventTypes : ['Food', 'Drinks', 'Nightlife', 'Movies', 'Sports', 'Casino', 'Others'],
  eventTypeMapping : {
    'Food' : 'restaurants',
    'Drinks' : 'coffee',
    'Nightlife' : 'nightlife',
    'Movies' : 'movietheaters',
    'Sports' : 'sportsteams',
    'Casino' : 'casinos',
    'Others': ''
  },
  numbers : Array.apply(null, {length: 1000}).map(Number.call, Number),
  messages: [' has requested to join your event ',
             ' has accepted your invitation to the event ',
             ' has left your event ',
             'You have been invited to the event ',
             'You have been removed from the event ',
             'Your request to join the event ',
             ' has been declined',
             'Your have been approved to join the event '],
  AndroidTabIcons : {
    'Events': require('../img/Restaurant.png'),
    'Notifications': require('../img/Info.png'),
    'Settings' : require('../img/Settings.png')},
  firebaseApp : firebase.initializeApp({
    apiKey: "AIzaSyA8G1jarjew06jjORJf7nA3DBvb0ks56LE",
    authDomain: "blink-b568e.firebaseapp.com",
    databaseURL: "https://blink-b568e.firebaseio.com",
    storageBucket: "blink-b568e.appspot.com",
    messagingSenderId: "600861396413"
  }),
  yelpAccess : {
    consumerKey : 'X2usS9bUAmkEqrVU3UT4og',
    consumerSecret : 'kyITUM8ZBfEsTBRWRHd7VznUAU8',
    tokenSecret : 'fPeYVE09hSyH4srgtx6fZJNlDis',
    token : '8UgZG2FCSCPcNFBYkMPUFgVHvY5_bv_M'
  },
  yelpAccess3 : {
    'clientId': '3Dkv7Ixgvy-7RNw0qi6OSg',
    'clientSecret': '1amb45xr3RKqRBkCiGq9bStmqX2Y3XcXVs3u5DbZsrYGwL7xPcI7hjjxVlbwRWXZ'
  },
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
  defaultSettings : {
    location : true,
    cover : true,
    event : true,
  },
  fbIcon : 'https://en.facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-logo.png',
  fbCover : 'https://tctechcrunch2011.files.wordpress.com/2016/07/facebook-search.png?w=738'
}

export default Constants;

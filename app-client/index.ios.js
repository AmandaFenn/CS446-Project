/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';
import * as firebase from 'firebase';

import Welcome from './iOSComps/Welcome';

const firebaseConfig = {
  apiKey: "AIzaSyA8G1jarjew06jjORJf7nA3DBvb0ks56LE",
  authDomain: "blink-b568e.firebaseapp.com",
  databaseURL: "https://blink-b568e.firebaseio.com",
  storageBucket: "blink-b568e.appspot.com",
  messagingSenderId: "600861396413"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Blink extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{ 
          component: Welcome,
          navigationBarHidden: true,
          title: 'Blink',
          passProps: { firebaseApp : firebaseApp }
        }}
        style = {styles.navigatorios}
      />
    );
  }
}

const styles = StyleSheet.create({
  navigatorios: {
    flex: 1,
  },
});        


AppRegistry.registerComponent('Blink', () => Blink);
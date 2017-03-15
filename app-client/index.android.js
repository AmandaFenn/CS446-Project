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
  Navigator,
  BackAndroid,
  TouchableHighlight
} from 'react-native';
import * as firebase from 'firebase';

import Welcome from './AndroidComps/Welcome';
import MainMenu from './AndroidComps/MainMenu';
import CreateEvent from './AndroidComps/CreateEvent';
import EventPage from './AndroidComps/EventPage';
import GuestList from './AndroidComps/GuestList';
import SearchEvent from './AndroidComps/SearchEvent';
import SuggestMap from './AndroidComps/SuggestMap';

const firebaseConfig = {
  apiKey: "AIzaSyA8G1jarjew06jjORJf7nA3DBvb0ks56LE",
  authDomain: "blink-b568e.firebaseapp.com",
  databaseURL: "https://blink-b568e.firebaseio.com",
  storageBucket: "blink-b568e.appspot.com",
  messagingSenderId: "600861396413"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Blink extends Component {
  componentWillMount() {
    console.log('willmount');
  }

  componentDidMount() {
    console.log('didmount');
  }

  renderScene(route, navigator) {
    switch (route.index) {
      case 0:
        return (<Welcome navigator = {navigator} firebaseApp = {firebaseApp}/>)
      case 1:
        return (<MainMenu route = {route} navigator = {navigator} firebaseApp = {firebaseApp}/>)
      case 2:
        return (<CreateEvent route = {route} navigator = {navigator} firebaseApp = {firebaseApp}/>)
      case 3:
        return (<EventPage route = {route} navigator = {navigator} firebaseApp = {firebaseApp}/>)
      case 4:
        return (<GuestList route = {route} navigator = {navigator} firebaseApp = {firebaseApp}/>)
      case 5:
        return (<SearchEvent route = {route} navigator = {navigator} firebaseApp = {firebaseApp}/>)
      case 6:
        return (<SuggestMap route = {route} navigator = {navigator} firebaseApp = {firebaseApp}/>)
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ title: 'Welcome', index: 0}}
        renderScene={this.renderScene}
        navigationBar={ <CustomNavigationBar
          routeMapper={routeMapper}
          navigationStyles={Navigator.NavigationBar.StylesIOS}
          style={styles.bar} />
        }
      />
    );
  }
}

class CustomNavigationBar extends Navigator.NavigationBar {
  render() {
    if (this.props.navState.routeStack.length > 1) {
      return super.render();
    }
    return null;
  }
}

var routeMapper = {
  LeftButton(route, navigator, index, navState) {
    return (
      <TouchableHighlight
        onPress={() => {navigator.pop();}}
        underlayColor = 'white'>
        <Text style={styles.text}> Back </Text>
      </TouchableHighlight>
    );
  },
  RightButton(route, navigator, index, navState) {
    return (
      <TouchableHighlight
         onPress={route.RightButtonPress}
         underlayColor = 'white'>
         <Text style={styles.text}> {route.RightButtonTitle} </Text>
      </TouchableHighlight>
    );
  },
  Title(route, navigator, index, navState) {
    return (<Text style={styles.text}> {route.title} </Text>);
  },
};


 const styles = StyleSheet.create({
   bar: {
     backgroundColor: '#3F51B5',
   },
   text: {
     color: '#fffff0',
     fontSize: 20,
     textAlign: 'center',
     alignItems: 'center'
   },
 });

AppRegistry.registerComponent('Blink', () => Blink);

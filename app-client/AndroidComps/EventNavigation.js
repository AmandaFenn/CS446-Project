import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  BackAndroid,
  TouchableHighlight
} from 'react-native';

import MainMenu from './MainMenu';
import CreateEvent from './CreateEvent';
import EventPage from './EventPage';
import GuestList from './GuestList';
import SearchEvent from './SearchEvent';
import SuggestMap from './SuggestMap';
import VotePage from './VotePage';
import Constants from '../utils/Constants'
const firebaseApp = Constants.firebaseApp

export default class EventNavigation extends Component {
  constructor(props){
    super(props)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  renderScene(route, navigator) {
    switch (route.index) {
      case 1:
        return (<MainMenu route = {route} navigator = {navigator} {... route.passProps} firebaseApp = {firebaseApp}/>)
      case 2:
        return (<CreateEvent route = {route} navigator = {navigator} {... route.passProps} firebaseApp = {firebaseApp}/>)
      case 3:
        return (<EventPage route = {route} navigator = {navigator} {... route.passProps} firebaseApp = {firebaseApp}/>)
      case 4:
        return (<GuestList route = {route} navigator = {navigator} {... route.passProps} firebaseApp = {firebaseApp}/>)
      case 5:
        return (<SearchEvent route = {route} navigator = {navigator} {... route.passProps} firebaseApp = {firebaseApp}/>)
      case 6:
        return (<SuggestMap route = {route} navigator = {navigator} {... route.passProps} firebaseApp = {firebaseApp}/>)
      case 7:
        return (<VotePage route = {route} navigator = {navigator} {... route.passProps} firebaseApp = {firebaseApp}/>)
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ title: 'Main Menu', index: 1}}
        renderScene={this.renderScene}
        navigationBar={ <Navigator.NavigationBar
          routeMapper={routeMapper}
          navigationStyles={Navigator.NavigationBar.StylesIOS}
          style={styles.bar} />
        }
      />
    );
  }
}

var routeMapper = {
  LeftButton(route, navigator, index, navState) {
    return ( route.index > 1 ?
      <TouchableHighlight
        style={{padding: 5}}
        onPress={() => {navigator.pop();}}
        underlayColor = 'white'>
        <Text style={styles.text}> Back </Text>
      </TouchableHighlight> : null
    );
  },
  RightButton(route, navigator, index, navState) {
    return (
      <TouchableHighlight
         style={{padding: 5}}
         onPress={route.RightButtonPress}
         underlayColor = 'white'>
         {route.RightButtonTitle != null ? <Text style={styles.text}> {route.RightButtonTitle} </Text> :
         <Image source={route.RightButtonIcon} style={{width: 30, height: 30}} />}
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

AppRegistry.registerComponent('EventNavigation', () => EventNavigation);

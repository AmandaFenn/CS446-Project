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

import Welcome from './AndroidComps/Welcome';
import MainMenu from './AndroidComps/MainMenu';

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
        return (<Welcome navigator = {navigator} />)
      case 1:
        return (<MainMenu route = {route} navigator = {navigator}/>)
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
 LeftButton(route, navigator, index, navState)
  { return (
    <TouchableHighlight onPress={() => {
     navigator.pop();}}
     underlayColor = 'white'>
      <Text style={styles.text}> Back </Text>
    </TouchableHighlight>);
 },
 RightButton(route, navigator, index, navState)
   { return null; },
 Title(route, navigator, index, navState)
   { return (<Text style={styles.text}> Blink </Text>); },
 };


 const styles = StyleSheet.create({
   bar: {
     backgroundColor: 'grey',
   },
   text: {
     color: '#fffff0',
     fontSize: 30,
     textAlign: 'center',
   },
 });

AppRegistry.registerComponent('Blink', () => Blink);

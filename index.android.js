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
  Navigator
} from 'react-native';

import Welcome from './AndroidComps/Welcome';
import MainMenu from './AndroidComps/MainMenu';

export default class Blink extends Component {
  renderScene(route, navigator) {
    switch (route.index) {
      case 0:
        return (<Welcome navigator = {navigator} />)
      case 1:
        return (<MainMenu navigator = {navigator}/>)
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ title: 'Welcome', index: 0 }}
        renderScene={this.renderScene}
      />
    );
  }
}



AppRegistry.registerComponent('Blink', () => Blink);

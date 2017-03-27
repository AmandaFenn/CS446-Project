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
import Welcome from './iOSComps/Welcome';

export default class Blink extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{ 
          component: Welcome,
          navigationBarHidden: true,
          title: 'Welcome',
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
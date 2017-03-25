/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Navigator,
} from 'react-native';

import Welcome from './AndroidComps/Welcome';
import Menus from './AndroidComps/Menus'

export default class Blink extends Component {
  componentWillMount() {
  }

  componentDidMount() {
  }

  renderScene(route, navigator) {
    switch (route.index) {
      case 0:
        return (<Welcome navigator = {navigator} />)
      case 1:
        return (<Menus navigator = {navigator} />)
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{ title: 'Welcome', index: 0}}
        renderScene={this.renderScene}
      />
    );
  }
}

AppRegistry.registerComponent('Blink', () => Blink);

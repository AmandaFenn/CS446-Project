import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

export default class Welcome extends Component {
  constructor(props){
    super(props)
  }

  _onForward() {
  }

  _getStarted() {
    this._onForward()
  }

  _onLogOut() {
    // Do not call Firebase signout here.
    alert("User logged out")
  }
}

AppRegistry.registerComponent('Welcome', () => Welcome);

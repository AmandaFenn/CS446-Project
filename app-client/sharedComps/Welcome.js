import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import {AccessToken} from 'react-native-fbsdk'

export default class Welcome extends Component {
  constructor(props){
    super(props)
  }

  _onForward() {
  }

  _getStarted() {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        if (data) {
          this._onForward()
        } else {
          alert('Please log in!')
        }
      }
    )
  }

  _onLogOut() {
    // Do not call Firebase signout here.
    alert("User logged out")
  }
}

AppRegistry.registerComponent('Welcome', () => Welcome);

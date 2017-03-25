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

  _onLogin(error, result) {
    if (error) {
        alert("Login failed with error: " + result.error);
    } else if (result.isCancelled) {
        alert("Login was cancelled");
    } else {
      this._onForward();
      //alert("Login was successful with permissions: " + result.grantedPermissions)
    }
  }

  _onLogOut() {
    alert('alert logout----')
    // Do not call Firebase signout here.
  }
}

AppRegistry.registerComponent('Welcome', () => Welcome);

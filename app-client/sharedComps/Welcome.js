import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import * as firebase from 'firebase';

import Constants from '../utils/Constants'
const firebaseApp = Constants.firebaseApp

export default class Welcome extends Component {
  constructor(props){
    super(props)
    this.state = {
      passProps: {}
    }
  }

  _onForward(props) {
  }

  _getStarted() {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        if (data) {
          this._loadPersonalInfo()
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
      this._loadPersonalInfo()
      //alert("Login was successful with permissions: " + result.grantedPermissions)
    }
  }

  _onLogOut() {
    alert('alert logout')
    // Do not call Firebase signout here.
  }

  _initPersonalInfo(result) {
    var userlistRef = firebaseApp.database().ref('Users/')
    var addUser = {};
    addUser[result.id] = {
      name: result.name,
      pic: result.picture.data.url,
      cover: result.cover ? result.cover.source: '',
      location: result.location ? result.location.name : ''
    }
    userlistRef.update(addUser)
  }

  _loadPersonalInfo() {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        let accessToken = data.accessToken
        // load personal information
        //alert(accessToken.toString())
        const responseInfoCallback = (error, result) => {
          if (error) {
            console.log(error)
            alert('Fail to fetch facebook information: ' + error.toString());
          } else {
            console.log(result)
            //alert('Success fetching data: ' + result.picture.data.url.toString());
            var passProps = {
              firebaseApp: firebaseApp,
              name: result.name,
              pic: result.picture.data.url,
              fbId: result.id
            }
            this.setState({
              passProps: passProps
            })
            this._initPersonalInfo(result)
            this._onForward(passProps)
          }
        }

        const infoRequest = new GraphRequest(
          '/me',
          {
            accessToken: accessToken,
            parameters: {
              fields: {
                string: 'id, email, name, picture, friends, cover, location'
              }
            }
          },
          responseInfoCallback
        );

        // Firebase authentication
        const provider = firebase.auth.FacebookAuthProvider;
        const credential = provider.credential(accessToken);
        firebaseApp.auth().signInWithCredential(credential).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('Email already associated with another account.');
            // Handle account linking here, if using.
          } else {
            console.error(error);
          }
        });

        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start()

      }
    )
  }

}

AppRegistry.registerComponent('Welcome', () => Welcome);

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'

export default class MainMenu extends Component {
  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      alert('Success fetching data: ' + result.toString());
    }
  }

  _onPressButton() {
    AccessToken.getCurrentAccessToken().then(
            (data) => {
              let accessToken = data.accessToken
              alert(accessToken.toString())

              const responseInfoCallback = (error, result) => {
                if (error) {
                  console.log(error)
                  alert('Error fetching data: ' + error.toString());
                } else {
                  console.log(result)
                  alert('Success fetching data: ' + result.toString());
                }
              }

              const infoRequest = new GraphRequest(
                '/me',
                {
                  accessToken: accessToken,
                  parameters: {
                    fields: {
                      string: 'email,name,first_name,middle_name,last_name'
                    }
                  }
                },
                responseInfoCallback
              );

              // Start the graph request.
              new GraphRequestManager().addRequest(infoRequest).start()

            }
          )

  }

  render() {
    return (
      <TouchableHighlight onPress={this._onPressButton}>
        <Text> Test </Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex:1,
    width: null,
    height: null,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    margin: 10,
    color: '#008b8b',
    backgroundColor: 'transparent'
  },
  texts: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    width: 200,
    color: '#708090',
    marginBottom: 5,
    backgroundColor: 'transparent'
  },
});

AppRegistry.registerComponent('MainMenu', () => MainMenu);

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
  Image
} from 'react-native';
import FBSDK, {LoginManager, LoginButton} from 'react-native-fbsdk'

export default class Blink extends Component {
  render() {
    return (
      <Image source={require('./img/blink.jpg')} style={styles.background}>
        <View style={styles.texts}>
          <Text style={styles.welcome}>
            Welcome to Blink!
          </Text>
          <Text style={styles.instructions}>
            Enabling you to do
          </Text>
          <Text style={styles.instructions}>
            what you want,
          </Text>
          <Text style={styles.instructions}>
            with who you want,
          </Text>
          <Text style={styles.instructions}>
            in the blink of an eye.
          </Text>
        </View>
        <LoginButton
          readPermissions={["public_profile"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </Image>
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

AppRegistry.registerComponent('Blink', () => Blink);

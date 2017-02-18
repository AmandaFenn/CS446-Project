import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight
} from 'react-native';
import FBSDK, {LoginManager, LoginButton} from 'react-native-fbsdk'

export default class Welcome extends Component {
  _onForward() {
    this.props.navigator.push({
      title: 'MainMenu',
      index: 1
    });
  }

  _onLogOut() {

    alert("User logged out")
  }

  render() {
    return (
      <Image source={require('../img/blink.jpg')} style={styles.background}>
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
        <TouchableHighlight onPress={this._onForward.bind(this)}>
          <Text style={styles.button}> Get Started! </Text>
        </TouchableHighlight>
        <LoginButton
          readPermissions={["public_profile", "user_friends"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                this._onForward();
                //alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={this._onLogOut.bind(this)}/>
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
    paddingBottom:100
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
  button: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fffff0',
    backgroundColor: '#008080',
    padding:10
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

AppRegistry.registerComponent('Welcome', () => Welcome);

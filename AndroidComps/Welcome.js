import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton} from 'react-native-fbsdk'

export default class Welcome extends Component {

  _onForward() {
    this.props.navigator.push({
      title: 'Blink',
      index: 1
    });
  }

  _onLogOut() {
    // Do not call Firebase signout here.
    alert("User logged out")
  }

  render() {
    return (
//      <Image source={require('../img/blink.jpg')} style={styles.background}>
      <View style={styles.container} >
        <StatusBar
          backgroundColor="#303F9F"
          barStyle="light-content"/>

        <Image source={require('../img/eye.png')} style={styles.icon}/>
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
        <View elevation={3} backgroundColor="black">
          <TouchableHighlight onPress={this._onForward.bind(this)}>
            <Text style={styles.button}> Get Started! </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.space}/>
        <View elevation={3} backgroundColor="black">
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
        </View>
      </View>
      //     </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
  },
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 50/2,
    borderWidth: 2,
    borderColor: '#303F9F',

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
    color: '#C5CAE9',
    backgroundColor: 'transparent'
  },
  texts: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    elevation: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#fffff0',
    backgroundColor: '#303F9F',
    padding:10,
    paddingBottom:10,
  },
  instructions: {
    fontSize: 20,
    fontWeight: '400',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    width: 200,
    color: '#FFFFFF',
    marginBottom: 5,
    backgroundColor: 'transparent'
  },
  space: {
    padding:6,
  }
});

AppRegistry.registerComponent('Welcome', () => Welcome);

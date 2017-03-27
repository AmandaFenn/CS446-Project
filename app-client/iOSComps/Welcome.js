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
import SharedWelcome from '../sharedComps/Welcome';
import Menus from '../iOSComps/Menus';

export default class Welcome extends SharedWelcome {
  constructor(props){
    super(props)
  }

  _onForward(props) {
    this.props.navigator.push({
      component: Menus,
      title: 'Blink',
      navigationBarHidden: true,
      passProps: props
    });
  }

  render() {
    return (
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
        <TouchableHighlight onPress={this._getStarted.bind(this)}>
          <Text style={styles.button}> Get Started! </Text>
        </TouchableHighlight>
        <View style={styles.space}/>
        <LoginButton
          readPermissions={["public_profile", "user_friends", "user_location"]}
          onLoginFinished={this._onLogin.bind(this)}/>
      </View>
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
  welcome: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    margin: 10,
    color: '#C5CAE9',
    backgroundColor: 'transparent'
  },
  button: {
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
    //fontFamily: 'sans-serif',
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

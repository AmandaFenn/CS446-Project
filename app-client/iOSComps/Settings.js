import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  BackAndroid,
  TouchableHighlight
} from 'react-native';
import FBSDK, {LoginManager, LoginButton} from 'react-native-fbsdk'

export default class Settings extends Component {
  componentWillMount() {
  }

  componentDidMount() {
  }


  render() {
    return (
      <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <View elevation={3}>
          <LoginButton
            onLogoutFinished={this.props.getBack}/>
        </View>
      </View> 
    );
  }
}

 const styles = StyleSheet.create({
   bar: {
     backgroundColor: '#3F51B5',
   },
   text: {
     color: '#fffff0',
     fontSize: 20,
     textAlign: 'center',
     alignItems: 'center'
   },
 });

AppRegistry.registerComponent('Settings', () => Settings);
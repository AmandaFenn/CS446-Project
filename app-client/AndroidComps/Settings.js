import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  Switch,
  TouchableHighlight
} from 'react-native';
import FBSDK, {LoginManager, LoginButton} from 'react-native-fbsdk'
import SharedSettings from '../sharedComps/Settings'

export default class Settings extends SharedSettings {
  render() {
    return (
      <View style = {styles.container}>
        <View style= {styles.bar}>
          <Text style={styles.text2}>Settings</Text>
        </View>
        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Allow others see my location</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchLocationSetting.bind(this)}
              value={this.state.location} />
          </View>
        </View>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Allow others see my cover</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchCoverSetting.bind(this)}
              value={this.state.cover} />
          </View>
        </View>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Allow others see my events</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchEventSetting.bind(this)}
              value={this.state.event} />
          </View>
        </View>

        <View elevation={3} style = {{flex: 1}}>
          <LoginButton
            onLogoutFinished={this.props.getBack}/>
        </View>
      </View>
    );
  }
}

const Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
   container: {
     flexDirection: 'column',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingHorizontal: 5,
     height: 600,
   },
   bar: {
     backgroundColor: '#7b68ee',
     justifyContent: 'center',
     alignItems: 'center',
     padding: 17,
     width: width
   },
   text: {
     color: '#fffff0',
     fontSize: 20,
     textAlign: 'center',
     alignItems: 'center'
   },
   location: {
     flex:3,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     height: 40
   },
   title: {
     fontSize:20,
     color:'rgba(5, 123, 253, 1.0)',
   },
   text2: {
     fontSize: 20,
     fontWeight: '600',
   }
 });

AppRegistry.registerComponent('Settings', () => Settings);

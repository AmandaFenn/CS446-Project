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
      <View style = {{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Allow others see my location
          </Text>
          <Switch
            onValueChange={this._onSwitchLocationSetting.bind(this)}
            style={{marginTop: 5}}
            value={this.state.location} />
        </View>
        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Allow others see my cover
          </Text>
          <Switch
            onValueChange={this._onSwitchCoverSetting.bind(this)}
            style={{marginTop: 5}}
            value={this.state.cover} />
        </View>
        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Allow others see my events
          </Text>
          <Switch
            onValueChange={this._onSwitchEventSetting.bind(this)}
            style={{marginTop: 5}}
            value={this.state.event} />
        </View>
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
   unlimited: {
     height: 40,
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   title: {
     fontSize:20,
     color:'rgba(5, 123, 253, 1.0)',
     paddingTop: 10
   },
 });

AppRegistry.registerComponent('Settings', () => Settings);

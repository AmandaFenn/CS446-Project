import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  MapView,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'

export default class SuggestMap extends Component {
  constructor(props){
    super(props)
    this.state = {
      test: 0
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{height: 500}}
          showsUserLocation={true}
          followUserLocation = {true}
        />
        <View style={styles.emptyview} />
        <TouchableHighlight
          style={styles.button}
          onPress={this._onBack.bind(this)}>
          <Text style={styles.buttontext}> Suggest </Text>
        </TouchableHighlight>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    //paddingTop: 40,
  },
  emptyview: {
    height: 40,
  },
  button: {
    alignItems: 'center',  
    marginHorizontal: 100,
    backgroundColor: '#303F9F',
  },
  buttontext: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fffff0',
    textAlign: 'center',
    paddingVertical:6,
  },
});

AppRegistry.registerComponent('SuggestMap', () => SuggestMap);
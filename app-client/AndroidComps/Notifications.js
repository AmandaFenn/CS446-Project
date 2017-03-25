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

export default class Notifications extends Component {
  componentWillMount() {
  }

  componentDidMount() {
  }


  render() {
    return (
      <View>
        <Text>Notifications</Text>
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

AppRegistry.registerComponent('Notifications', () => Notifications);

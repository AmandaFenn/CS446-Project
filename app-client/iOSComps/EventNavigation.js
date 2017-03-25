import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  NavigatorIOS,
} from 'react-native';
import MainMenu from '../iOSComps/MainMenu';

export default class EventNavigation extends Component {
  constructor(props){
    super(props)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    return (
      <NavigatorIOS
        style = {{flex:1}}
        initialRoute={{ 
          component: MainMenu,
          title: 'Main Menu',
          passProps: this.props
        }}
      />
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

AppRegistry.registerComponent('EventNavigation', () => EventNavigation);
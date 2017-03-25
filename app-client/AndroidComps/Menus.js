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
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';
import EventNavigation from './EventNavigation'
import Notifications from './Notifications'
import Settings from './Settings'


export default class Menus extends Component {
  componentWillMount() {
  }

  componentDidMount() {
  }

  _onBack() {
    this.props.navigator.replace({ title: 'Welcome', index: 0});
  }

  render() {
    return (
      <ScrollableTabView
      renderTabBar={() => <DefaultTabBar />}
      tabBarPosition='bottom'
      >
        <EventNavigation tabLabel='Events'/>
        <Notifications tabLabel='Notifications'/>
        <Settings tabLabel='Settings' getBack = {this._onBack.bind(this)}/>
      </ScrollableTabView>
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

AppRegistry.registerComponent('Menus', () => Menus);

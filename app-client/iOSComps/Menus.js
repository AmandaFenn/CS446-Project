import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TabBarIOS
} from 'react-native';
import SharedMenus from '../sharedComps/Menus';
import Welcome from './Welcome'
import EventNavigation from './EventNavigation'
import Notifications from './Notifications'
import Settings from './Settings'

export default class Menus extends SharedMenus {
  constructor(props){
    super(props)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  _onBack() {
    this.props.navigator.replace({
      component: Welcome,
      navigationBarHidden: true,
      title: 'Welcome',
    });
  }

  render() {
    return (
      <TabBarIOS style = {{height:100}}
        unselectedTintColor="grey"
        tintColor='rgba(5, 123, 253, 1.0)'
        unselectedItemTintColor="grey"
        barTintColor="white">
        <TabBarIOS.Item
          icon={require('../img/TabBarIcons/Bar.png')}
          selectedIcon={require('../img/TabBarIcons/BarFill.png')}
          title="Events"
          selected={this.state.selectedTab == 0}
          onPress={() => {
            this.setState({
              selectedTab: 0,
            });
          }}>
          <EventNavigation
            firebaseApp = {this.props.firebaseApp}
            name = {this.props.name}
            pic = {this.props.pic}
            fbId = {this.props.fbId}/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          icon={require('../img/TabBarIcons/Info.png')}
          selectedIcon={require('../img/TabBarIcons/InfoFill.png')}
          title="Notifications"
          selected={this.state.selectedTab == 1}
          onPress={() => {
            this.setState({
              selectedTab: 1,
            });
          }}>
          <Notifications
            firebaseApp = {this.props.firebaseApp}
            fbId = {this.props.fbId}/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          icon={require('../img/TabBarIcons/Settings.png')}
          selectedIcon={require('../img/TabBarIcons/SettingsFill.png')}
          title="Settings"
          selected={this.state.selectedTab == 2}
          onPress={() => {
            this.setState({
              selectedTab: 2,
            });
          }}>
          <Settings
            firebaseApp = {this.props.firebaseApp}
            fbId = {this.props.fbId}
            getBack = {this._onBack.bind(this)}
          />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

AppRegistry.registerComponent('Menus', () => Menus);

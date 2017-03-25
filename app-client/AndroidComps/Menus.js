import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableNativeFeedback
} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import SharedMenus from '../sharedComps/Menus'
import EventNavigation from './EventNavigation'
import Notifications from './Notifications'
import Settings from './Settings'
import TextWithIcon from '../Buttons/TextWithIcon'
import Constants from '../utils/Constants'

export default class Menus extends SharedMenus {
  componentWillMount() {
  }

  componentDidMount() {
  }

  _onBack() {
    this.props.navigator.replace({ title: 'Welcome', index: 0});
  }

  _renderTab(name, page, isTabActive, onPressHandler) {
    activeColor = 'black'
    inactiveColor = 'grey'
    const tabColor = isTabActive ? activeColor : inactiveColor;
    var icon = Constants.AndroidTabIcons[name]

    return (
      <TouchableNativeFeedback
        style={styles.flexOne}
        key={name}
        delayPressIn={0}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => onPressHandler(page)}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
        <View style = {{flex: 1, flexDirection: 'row'}}>
          <View style ={styles.tabImage}>
          <Image
            style={{opacity: isTabActive ? 1.0 : 0.4, width: 30, height: 30}}
            resizeMode={Image.resizeMode.stretch}
            source={icon} />
          </View>
          <View style={styles.tabText}>
            <Text
              style={{color: tabColor}}>
            {name}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    return (
      <ScrollableTabView
      renderTabBar={() =>
        <DefaultTabBar
          renderTab = {this._renderTab}
          activeTextColor = 'black'
          inactiveTextColor = 'grey'
          underlineStyle = {{backgroundColor: 'black', height: 2}}/>}
      tabBarPosition='bottom'
      >
        <EventNavigation
          tabLabel='Events'
          firebaseApp = {this.props.firebaseApp}
          name = {this.props.name}
          pic = {this.props.pic}
          fbId = {this.props.fbId}/>
        <Notifications
          tabLabel='Notifications'
          firebaseApp = {this.props.firebaseApp}
          fbId = {this.props.fbId}/>
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
   flexOne: {
     flex: 1,
   },
   tabImage: {
     flex:1,
     justifyContent: 'center',
     alignItems: 'center'
   },
   tabText: {
     flex:2,
     justifyContent: 'center',
     alignItems: 'center'
   }
 })

AppRegistry.registerComponent('Menus', () => Menus);

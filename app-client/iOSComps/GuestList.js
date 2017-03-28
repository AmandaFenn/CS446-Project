import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
} from 'react-native';
import SharedGuestList from '../sharedComps/GuestList'
import Profile from '../iOSComps/Profile'

export default class GuestList extends SharedGuestList {
  constructor(props){
    super(props)
  }

  _onProfile(rowID) {
    this.props.navigator.push({
      component: Profile,
      title: 'Profile',
      passProps: {
        firebaseApp : this.props.firebaseApp,
        name : this.state.guests[rowID].Name,
        pic : this.state.guests[rowID].pic,
        fbId : this.state.guestIds[rowID],
        myfbId: this.props.fbId
      }
    })
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.profile}>
        <TouchableHighlight
          onPress = {this._onProfile.bind(this, rowID)}>
          <Image
            source={{uri: rowData.pic}}
            style={{width:50, height: 50}} />
        </TouchableHighlight>
        <Text style = {styles.text1}
          numberOfLines={1}>
          {rowData.Name}
        </Text>
        {this.props.host && this.props.guest && this._pending(rowID) && <TouchableHighlight
          style={styles.button}
          onPress = {this._accept.bind(this, rowID)}>
          <Text style = {styles.buttontext}> Accept </Text>
        </TouchableHighlight>}

        {this.props.host && (this.props.guest || !this._isMember(rowID)) && <TouchableHighlight
          style={styles.button}
          onPress = {this._deleteOrInvite.bind(this, rowID)}>
          <Text style = {styles.buttontext}> {this.props.guest ? 'Delete' : 'Invite'} </Text>
        </TouchableHighlight>}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <ListView
            dataSource={this.state.guestsDataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
          </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom:10,
  },
  container2: {
    flex: 3,
    width: 400,
    backgroundColor: '#C5CAE9',
    padding: 10
  },
  profile: {
    flex : 1,
    flexDirection: 'row',
    padding : 10
  },
  text1: {
    flex: 5,
    color: '#fffff0',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingLeft: 5
  },
  button: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#303F9F',
    padding: 5
  },
  buttontext: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    width:60,
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('GuestList', () => GuestList);

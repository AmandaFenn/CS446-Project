import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  ActivityIndicator
} from 'react-native';
import SharedProfile from '../sharedComps/Profile'
import Constants from '../utils/Constants'

export default class Profile extends SharedProfile {
  constructor(props){
    super(props)
  }

  _onEvent(rowData, rowID) {
    this.props.navigator.push({
      title: rowData,
      index: 3,
      passProps: {
        firebaseApp : this.props.firebaseApp,
        name : this.props.name,
        title : rowData,
        fbId : this.props.myfbId,
        eventId : this.state.eventIds[rowID]
      }
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight onPress = {this._onEvent.bind(this, rowData, rowID)}>
        <Text style = {styles.text1}
          numberOfLines={1}>
          {rowData}
      </Text>
      </TouchableHighlight>
    )
  }

  _renderSeparator(sectionID , rowID , adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
        height: adjacentRowHighlighted ? 4 : 1,
        backgroundColor: adjacentRowHighlighted ? '#3F51B5' : '#C5CAE9',
      }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: this.state.userInfo && this.state.userInfo.Settings &&
            (this.state.myEvent || this.state.userInfo.Settings.cover) && 
            this.state.userInfo.cover != '' ? this.state.userInfo.cover : Constants.fbCover}}
          style={{width: 400, height: 120}}/>
        <View style={styles.container1}>
          <View style={styles.profile}>
            <Image
              source={{uri: this.props.pic != '' ? this.props.pic : Constants.fbIcon}}
              style={{width: 80, height: 80}}
              boarderWidth="2"
              borderColor="black" />
            <View style = {{justifyContent: 'space-around'}}>
              <Text style={styles.text}>
                {' ' + this.props.name}
              </Text>
            </View>
          </View>
          <View style={styles.location}>
            <Text
              style={styles.text}>
              Location: {
                this.state.userInfo && this.state.userInfo.Settings &&
                (this.state.myEvent || this.state.userInfo.Settings.location && this.state.userInfo.location)
                ? this.state.userInfo.location : ''}
            </Text>
          </View>
        </View>
        <View style={styles.container2}>
          {this.state.loadingEvents ? <ActivityIndicator
            animating={this.state.loadingEvents}
            style={[styles.centering, {height: 80}]}
            size="large"/> :
          <ListView
            dataSource={this.state.events}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            renderSeparator={this._renderSeparator} />}
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
    paddingTop: 60,
    paddingHorizontal: 6
  },
  container1: {
    flex: 1,
    width: 400
    //justifyContent: 'space-around',
    //alignItems: 'center',
  },
  container2: {
    //flex: 3,
    width: 400,
    height: 300
  },
  profile: {
    flexDirection: 'row',
  },
  location: {
    flex: 1
  },
  text: {
    color: '#212121',
    fontSize: 30,
    fontWeight: '300',
    backgroundColor: 'transparent'
  },
  text1: {
    color: '#303F9F',
    fontSize: 30,
    //fontFamily: 'sans-serif',
    fontWeight: '300',
    backgroundColor: 'transparent'
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

AppRegistry.registerComponent('Profile', () => Profile);

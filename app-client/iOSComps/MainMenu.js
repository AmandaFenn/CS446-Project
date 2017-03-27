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
import SharedMainMenu from '../sharedComps/MainMenu';
import SearchEvent from '../iOSComps/SearchEvent';
import CreateEvent from '../iOSComps/CreateEvent';
import EventPage from '../iOSComps/EventPage';

export default class MainMenu extends SharedMainMenu {
  constructor(props){
    super(props)
  }
  
  _onSearchEvent() {
    this.props.navigator.push({
      component: SearchEvent,
      title: 'Find Events',
      passProps: { 
        firebaseApp : this.props.firebaseApp,
        name : this.props.name,
        fbId : this.props.fbId
      }
    });
  }
  
  _onCreateEvent() {
    this.props.navigator.push({
      component: CreateEvent,
      title: 'New Event',
      rightButtonTitle: 'Create',
      passProps: { 
        firebaseApp : this.props.firebaseApp,
        name : this.props.name,
        fbId : this.props.fbId
      }
    });
  }
 
  _onMyEvent(rowData, rowID) {
    this.props.navigator.push({
      component: EventPage,
      title: rowData,
      passProps: { 
        firebaseApp : this.props.firebaseApp,
        name : this.props.name,
        title : rowData,
        fbId : this.props.fbId,
        eventId : this.state.myeventIds[rowID]
      }
    });
    //console.log(this.state.myeventIds[rowID])
  }
  
  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight onPress = {this._onMyEvent.bind(this, rowData, rowID)}>
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
        <View style={styles.container1}>
          <View style={styles.profile}>
            <Image 
              source={{uri: this.props.pic}}
              style={{width: 80, height: 80}}
              boarderWidth="2"
              borderColor="black" />
            <Text style={styles.text}>
              {this.props.name}
            </Text>
          </View>
          <TouchableHighlight onPress = {this._onSearchEvent.bind(this)}>
            <Text style={styles.button}> Find Events </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress = {this._onCreateEvent.bind(this)}>
            <Text style={styles.button}> Create Events </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container2}>
          {this.state.loadingEvents ? <ActivityIndicator
            animating={this.state.loadingEvents}
            style={[styles.centering, {height: 80}]}
            size="large"/> :
          <ListView 
            dataSource={this.state.myevents}
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
    paddingBottom: 60,
  },
  container1: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  container2: {
    //flex: 3,
    width: 360,
    height: 300
  },
  profile: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    width: 200,
    color: '#fffff0',
    backgroundColor: '#303F9F',
    textAlign: 'center',
    paddingVertical:10
  },
  text: {
    color: '#212121',
    fontSize: 20,
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

AppRegistry.registerComponent('MainMenu', () => MainMenu);

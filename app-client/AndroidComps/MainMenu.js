import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import SharedMainMenu from '../sharedComps/MainMenu';

export default class MainMenu extends SharedMainMenu {
  constructor(props){
    super(props)
  }

  _onSearchEvent() {
    this.props.navigator.push({
      title : 'Find Events',
      index : 5,
      passProps: {
        name : this.props.name,
        fbId : this.props.fbId
      }
    });
  }

  _onCreateEvent() {
    this.props.navigator.push({
      title : 'New Event',
      index : 2,
      passProps: {
        name : this.props.name,
        fbId : this.props.fbId,
      }
    });
  }

  _onMyEvent(rowData, rowID) {
    this.props.navigator.push({
      title : rowData,
      index : 3,
      passProps: {
        name : this.props.name,         // host name
        fbId : this.props.fbId,
        eventId : this.state.myeventIds[rowID]
      }
    });
    //console.log(this.state.myeventIds[rowID])
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight onPress = {this._onMyEvent.bind(this, rowData, rowID)}>
        <View style={styles.eventItem}>
          <Text
            style={styles.eventItemText}
            numberOfLines={1}>
            {rowData}
          </Text>
        </View>
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
            <Image source={{uri: this.props.pic}}
              style={styles.profilePicture}/>
            <Text style={styles.profileName}>
              {this.props.name}
            </Text>
          </View>
          <TouchableHighlight onPress={this._onSearchEvent.bind(this)}>
            <Text style={styles.button}>Find Events</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._onCreateEvent.bind(this)}>
            <Text style={styles.button}>Create Event</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.myEventsLabel}>
          <Text style={styles.myEventsText}>My Events</Text>
          <View style={styles.myEventsHr}/>
        </View>
        <View style={styles.container2}>
          {this.state.loadingEvents ?
            <ActivityIndicator
              animating={this.state.loadingEvents}
              style={[styles.centering, {height: 80}]}
              size="large"
            /> :
            <ListView
              dataSource={this.state.myevents}
              renderRow={this._renderRow.bind(this)}
              enableEmptySections={true}
              renderSeparator={this._renderSeparator}
            />
          }
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
  container1: {
    flex: 2,
    alignItems: 'center',
  },
  container2: {
    flex: 3,
    width: 400,
  },
  profile: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 80,
    height: 80,
  },
  profileName: {
    color: 'black',
    fontSize: 20,
    fontWeight: '300',
    marginTop: 0,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    width: 200,
    color: '#fffff0',
    backgroundColor: '#303F9F',
    textAlign: 'center',
    padding: 10,
    margin: 7,
  },
  eventItem: {
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 7,
    margin: 12,
    padding: 10,
    backgroundColor: '#c6e2ec'
  },
  eventItemText: {
    color: '#303F9F',
    fontSize: 22,
    //fontFamily: 'sans-serif',
    fontWeight: '300',
    //backgroundColor: 'transparent',

  },
  myEventsLabel: {
    margin: 10,
    width: Dimensions.get('window').width - 20,
    marginTop: 50,
    marginBottom: 10,
  },
  myEventsHr: {
    height: 2,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  myEventsText: {
    fontSize: 18,
  },
});

AppRegistry.registerComponent('MainMenu', () => MainMenu);

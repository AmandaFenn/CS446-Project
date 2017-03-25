import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import * as firebase from 'firebase';
import {createListdataSource} from '../utils/HelpFuncs';

export default class MainMenu extends Component {
  constructor(props){
    super(props)
    this.state = {
      myevents: createListdataSource([]),
      myeventIds: [],
      eventsRef : this.props.firebaseApp.database().ref('Events/'),
    }
  }

  componentWillMount() {
    this._eventsChangeCallBack = this._eventsChangeCallBack.bind(this)
    this._updateEvents()
  }
  
  componentWillUnmount() {
    this.state.eventsRef.off('value', this._eventsChangeCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _eventsChangeCallBack(snapshot) {
    var events = []
    var eventIds = []
    var fbId = this.props.fbId.toString()
    console.log('facebookid--------: ' + this.props.name)
    snapshot.forEach(function(data) {
      if (data.child('Participants').hasChild(fbId)) {
        events.push(data.val().Name)
        eventIds.push(data.key)
      }
    });
    this.setState({
      myevents: createListdataSource(events),
      myeventIds: eventIds
    });
  }

  _updateEvents() {
    this.state.eventsRef.on('value', this._eventsChangeCallBack, function(error) {
      console.error(error);
    });
  }

  // Test methods, to be deleted later

  _createEventTest() {
    var eventlistRef = this.props.firebaseApp.database().ref('Events/').push()
    var date = new Date()
    eventlistRef.set({
      'Name': this.props.name + '\'s Event',
      'Date': date.toLocaleString(),
      'Location': 'Waterloo',
      'Description': '',
    })
    var addHost = {};
    var hostData = {
       'Name': this.props.name,
       'Host': true,
       'Status': 0
    }
    var newPostKey = eventlistRef.key
    addHost['/Events/' + newPostKey + '/Participants/' + this.props.fbId] = hostData;
    this.props.firebaseApp.database().ref().update(addHost)
  }

  _deleteEventTest1(snapshot) {
    var test = '1'
    snapshot.forEach(function(data) {
      if (data.val().Location == 'Waterloo') {
        console.log(data.key)
        test = data.key
      }
    })
    //console.log(test)
    var guestData = {
       'Name': 'Guest',
       'Host': false,
       'Status': 0
    }
    // add new participants
    this.props.firebaseApp.database().ref('Events/' + test + '/Participants/123456').set(guestData)

    //this.props.firebaseApp.database().ref('Events/' + test).remove()
  }

  _deleteEventTest() {
    this.state.eventsRef.once('value').then(this._deleteEventTest1.bind(this))
  }

  // Above: test methods
  
  _onMyEvent(rowData, rowID) {
  }

  _onLogOut() {
    // Do not call Firebase signout here.
    this._onBack()
  }
}

AppRegistry.registerComponent('MainMenu', () => MainMenu);

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import {createListdataSource} from '../utils/HelpFuncs';

export default class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      userInfo: {},
      userInfoRef : this.props.firebaseApp.database().ref('Users/' + this.props.fbId),
      events: createListdataSource([]),
      eventIds: [],
      eventsRef : this.props.firebaseApp.database().ref('Events/'),
      loadingEvents : true,
    }
  }

  componentWillMount() {
    this._loadUserInfo()
  }

  componentWillUnmount() {
    this.state.eventsRef.off('value', this._eventsChangeCallBack)
    this.state.userInfoRef.off('value', this._loadUserInfoCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _loadUserInfoCallBack(snapshot) {
    this.setState({
      userInfo: snapshot.val()
    });
    this._updateEvents()
  }

  _loadUserInfo() {
    this._loadUserInfoCallBack = this._loadUserInfoCallBack.bind(this)
    this.state.userInfoRef.on('value', this._loadUserInfoCallBack, function(error) {
      console.error(error);
    });
  }

  _eventsChangeCallBack(snapshot) {
    var events = []
    var eventIds = []
    var fbId = this.props.fbId.toString()
    if (this.state.userInfo.Settings && this.state.userInfo.Settings.event) {
      snapshot.forEach(function(data) {
        if (data.child('Participants').hasChild(fbId)) {
          events.push(data.val().Name)
          eventIds.push(data.key)
        }
      })
    }
    this.setState({
      events: createListdataSource(events),
      eventIds: eventIds,
      loadingEvents: false
    });
  }

  _updateEvents() {
    this._eventsChangeCallBack = this._eventsChangeCallBack.bind(this)
    this.state.eventsRef.on('value', this._eventsChangeCallBack, function(error) {
      console.error(error);
    });
  }

  _onEvent(rowData, rowID) {
  }

}

AppRegistry.registerComponent('Profile', () => Profile);

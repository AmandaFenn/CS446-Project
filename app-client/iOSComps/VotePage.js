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

import SharedVotePage from '../sharedComps/VotePage';

const nativeImageSource = require('nativeImageSource');

export default class VotePage extends SharedVotePage {
  constructor(props) {
    super(props)
  }  
  
  componentWillMount() {
    this._updateNav(this.props.host)
    this._loadVotesCallBack = this._loadVotesCallBack.bind(this)
    this._loadVotes()
  }
  
  _updateNav(host) {
    this.props.navigator.replace({
      component: VotePage,
      title: this.props.title,
      rightButtonIcon: (host || this.state.guestVote) ? require('../img/NavBarButtonPlus@3x.png') : null,
      onRightButtonPress: (host || this.state.guestVote) ? this._newVote.bind(this) : null,
      passProps: { 
        firebaseApp : this.props.firebaseApp,
        fbId : this.props.fbId,
        eventId : this.props.eventId
      }
    });
  }

}

AppRegistry.registerComponent('VotePage', () => VotePage);
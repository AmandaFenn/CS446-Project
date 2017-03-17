import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import * as firebase from 'firebase';
import {createListdataSource} from '../utils/HelpFuncs';

export default class VotePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      votesDataSource: createListdataSource([]),
      votesRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId + '/Votes'),
      votes: [],
      voteIds : [],
      guestVote: true,
    }
    console.log(this.props.eventId)
  }

  componentWillMount() {
    this._updateNav()
    this._loadVotesCallBack = this._loadVotesCallBack.bind(this)
    this._loadVotes()
  }

  componentWillUnmount() {
    this.state.votesRef.off('value', this._loadVotesCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _updateNav() {
  }

  _loadVotesCallBack(snapshot) {
    var votes = []
    var voteIds = []
    snapshot.forEach(function(data) {
      votes.push(data.val())
      voteIds.push(data.key)
      console.log(data.val())
    });
    this.setState({
      votes: votes,
      voteIds: voteIds,
      votesDataSource: createListdataSource(votes),
    });
  }

  _loadVotes() {
    this.state.votesRef.on('value', this._loadVotesCallBack, function(error) {
      console.error(error);
    });
  }

  _newVote() {
    var votelistRef = this.state.votesRef.push()
    votelistRef.set({
      'Name': 'Vote test',
    })
  }
}

AppRegistry.registerComponent('VotePage', () => VotePage);

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
      selectedVoteId : '',
      seletedVoteTopic: '',
      guestVote: true,
      modalVisible: false,
      createMode: false,
    }
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

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _newVote() {
    this.setState({createMode: true})
    this._setModalVisible(true)
  }

  _deleteVote(rowID) {
    var id = this.state.voteIds[rowID]
    this.state.votesRef.child(id).remove()
  }

  _onVote(rowID) {
    this.setState({
      createMode: false,
      selectedVoteId: this.state.voteIds[rowID],
      seletedVoteTopic: this.state.votes[rowID].Name
    })
    this._setModalVisible(true)
  }
}

AppRegistry.registerComponent('VotePage', () => VotePage);

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
      modalVisible: false,
      createMode: false,
      topicTmp: '',
      descriptionTmp: '',
      voteItemTmp: '',
      voteItemsTmp: [],
      voteItemsDataSourceTmp: createListdataSource([])
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

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _newVote() {
    this._cleanTmp()
    this.setState({createMode: true})
    this._setModalVisible(true)
  }

  _deleteVote(rowID) {
    var id = this.state.voteIds[rowID]
    this.setState({
      votes: [],
      voteIds: []
    })
    this.state.votesRef.child(id).remove()
  }

  _onVote(rowID) {
    this.setState({
      createMode: false,
      voteItemsDataSourceTmp: createListdataSource([])
    })
    this._setModalVisible(true)
  }

  _addItem() {
    if (!this._checkItemInfo()) {
      voteItems = this.state.voteItemsTmp
      voteItems.push(this.state.voteItemTmp)
      this.setState({
        voteItemsTmp: voteItems,
        voteItemsDataSourceTmp: createListdataSource(this.state.votes[this.state.voteIds][Items].key),
        voteItemTmp: ''
      })
    }
  }

  _createVote() {
    var votelistRef = this.state.votesRef.push()
    votelistRef.set({
      'Name': this.state.topicTmp,
      'Description': ''
    })
    var voteItems = {}
    if (this.state.voteItemsTmp.length > 0) {
      for (i=0; i<this.state.voteItemsTmp.length; i++) {
        voteItems[this.state.voteItemsTmp[i]] = 0
      }
      votelistRef.update({'Items':voteItems})
    }
  }

  _submit() {
    if (!this._checkInfo()) {
      this._createVote()
      this._setModalVisible(false)
    }
  }

  _leaveModal() {
    this._setModalVisible(false)
  }

  _cleanTmp() {
    this.setState({
      topicTmp: '',
      descriptionTmp: '',
      voteItemTmp: '',
      voteItemsTmp: []
    })
  }

  _checkItemInfo() {
    var check = false
    var checkInfo = ''
    if (this.state.voteItemTmp == '') {
      check = true
      checkInfo += 'Please enter the vote item!\n'
    }

    for (i = 0; i < this.state.voteItemsTmp.length;i++) {
      if (this.state.voteItemTmp == this.state.voteItemsTmp[i]) {
        check = true
        checkInfo += this.state.voteItemTmp + ' has been added to vote items!\n'
      }
    }

    if (check) {
      alert(checkInfo)
    }
    return check
  }

  _checkInfo() {
    var check = false
    var checkInfo = ''
    if (this.state.topicTmp == '') {
      check = true
      checkInfo += 'Please enter the vote topic!\n'
    }

    if (check) {
      alert(checkInfo)
    }
    return check
  }
}

AppRegistry.registerComponent('VotePage', () => VotePage);

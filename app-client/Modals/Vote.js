import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import {createListdataSource} from '../utils/HelpFuncs'
import ButtonWithIcon from '../Buttons/ButtonWithIcon'

export default class Vote extends Component {
  constructor(props) {
    super(props)
    this.state = {
      voteItemsRef : this.props.votesRef.child(this.props.voteId + '/Items'),
      voteTopicTmp: '',
      voteItemTmp: '',
      voteItems: [],
      voteItemScores: [],
      voters: [],
      voteItemsDataSource: createListdataSource([]),
    }
  }

  componentWillMount() {
    if (!this.props.createMode) {
      this._loadVoteItemsCallBack = this._loadVoteItemsCallBack.bind(this)
      this._loadVoteItems()
    }
  }

  componentWillUnmount() {
    if (!this.props.createMode) {
      this.state.voteItemsRef.off('value', this._loadVoteItemsCallBack);
    }
  }

  _loadVoteItemsCallBack(snapshot) {
    var voteItems = []
    var voteItemScores = []
    var voters = []
    snapshot.forEach(function(data) {
      voteItems.push(data.key)
      voteItemScores.push(parseInt(data.val().Score))
      voters.push(data.val().Voters)
    });
    this.setState({
      voteItems: voteItems,
      voteItemScores: voteItemScores,
      voters: voters,
      voteItemsDataSource: createListdataSource(voteItems),
    });
  }

  _loadVoteItems() {
    this.state.voteItemsRef.on('value', this._loadVoteItemsCallBack, function(error) {
      console.error(error);
    });
  }

  _createVote() {
    var votelistRef = this.props.votesRef.push()
    votelistRef.set({
      'Name': this.state.voteTopicTmp,
      'Creator': this.props.fbId,
      'Description': ''
    })
    var voteItems = {}
    if (this.state.voteItems.length > 0) {
      for (i=0; i<this.state.voteItems.length; i++) {
        voteItems[this.state.voteItems[i]] = {Score: 0}
      }
      votelistRef.update({'Items':voteItems})
    }
  }

  _submit() {
    if (!this._checkInfo()) {
      this._createVote()
      this._cleanInfo()
      this.props.modalParent._setModalVisible(false)
    }
  }

  _leaveModal() {
    this._cleanInfo()
    this.props.modalParent._setModalVisible(false)
  }

  _addItem() {
    if (!this._checkItemInfo()) {
      voteItems = this.state.voteItems
      voteItems.push(this.state.voteItemTmp)
      updateData = {}
      updateData[this.state.voteItemTmp] = {Score: 0}
      this.setState({
        voteItemTmp: '',
        voteItems: voteItems,
        voteItemsDataSource: createListdataSource(voteItems),
      })
      if (!this.props.createMode) {
        this.state.voteItemsRef.update(updateData)
      }
    }
  }

  _deleteItem(rowID) {
    if (this.props.createMode) {
      voteItems = []
      for (i = 0; i< this.state.voteItems.length; i++) {
        if (i != rowID) {
          voteItems.push(this.state.voteItems[i])
        }
      }
      this.setState({
        voteItems: voteItems,
        voteItemsDataSource: createListdataSource(voteItems),
      })
    } else {
      this.state.voteItemsRef.child(this.state.voteItems[rowID]).remove()
      this.setState({
        toDelete: rowID
      })
    }
  }

  _updateVoteCount(id, i) {
    var updateScore = {}
    updateScore['Score'] = this.state.voteItemScores[id] + i
    this.state.voteItemsRef.child(this.state.voteItems[id]).update(updateScore)
  }

  _hasVote() {
    for (j=0; j<this.state.voters.length; j++) {
      if (this._hasVoteItem(j)) {
        return true
      }
    }
    return false
  }

  _hasVoteItem(rowID) {
    if (this.state.voters[rowID] == undefined) {
      return false
    }
    voters = Object.keys(this.state.voters[rowID])
    for (i=0; i<voters.length; i++) {
      if (voters[i] == this.props.fbId) {
        return true
      }
    }
    return false
  }

  _vote(rowID) {
    if (this._hasVoteItem(rowID)) {
      alert('You have voted for: ' + this.state.voteItems[rowID])
    } else {
      var updateVoter = {}
      updateVoter[this.props.fbId] = 1
      this.state.voteItemsRef.child(this.state.voteItems[rowID] + '/Voters').update(updateVoter)
      this._updateVoteCount(rowID, 1)
    }
  }

  _undoVote(rowID) {
    if (!this._hasVoteItem(rowID)) {
      alert('You have not voted for: ' + this.state.voteItems[rowID])
    } else {
      this.state.voteItemsRef.child(this.state.voteItems[rowID] + '/Voters/' + this.props.fbId).remove()
      this._updateVoteCount(rowID, -1)
    }
  }

  _checkItemInfo() {
    var check = false
    var checkInfo = ''
    if (this.state.voteItemTmp == '') {
      check = true
      checkInfo += 'Please enter the vote item!\n'
    }

    for (i = 0; i < this.state.voteItems.length;i++) {
      if (this.state.voteItemTmp == this.state.voteItems[i]) {
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
    if (this.state.voteTopicTmp == '') {
      check = true
      checkInfo += 'Please enter the vote topic!\n'
    }

    if (check) {
      alert(checkInfo)
    }
    return check
  }

  _cleanInfo() {
    this.setState({
      voteTopicTmp: '',
      voteItemTmp: '',
      voteItems: [],
      voteItemsDataSource: createListdataSource([])
    })
  }
}

AppRegistry.registerComponent('Vote', () => Vote);

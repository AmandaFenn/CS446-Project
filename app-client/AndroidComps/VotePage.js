import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  Modal
} from 'react-native';

import SharedVotePage from '../sharedComps/VotePage'
import Vote from '../Modals/Vote'
import ButtonWithIcon from '../Buttons/ButtonWithIcon'

export default class VotePage extends SharedVotePage {
  constructor(props) {
    super(props)
  }

  _updateNav() {
    this.props.route.RightButtonIcon = (this.props.host || this.state.guestVote) ? require('../img/android_plus.png') : null
    this.props.route.RightButtonPress = (this.props.host || this.state.guestVote) ? this._newVote.bind(this) : null
  }

  _renderItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.profile}>
        <Text style = {styles.text1}> {rowData} </Text>
        <TouchableHighlight
          style={{width: 30, height: 30}}
          onPress={this._deleteVote.bind(this, rowID)}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../img/android_minus.png')} />
        </TouchableHighlight>
      </View>
    )
  }

  _renderVote(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.profile}>
        <TouchableHighlight
          style = {{flex: 5}}
          onPress={this._onVote.bind(this, rowID)}>
          <Text style = {styles.text1}> {rowData.Name} </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={{width: 30, height: 30}}
          onPress={this._deleteVote.bind(this, rowID)}>
          <Image
            style={{width: 30, height: 30}}
            source={require('../img/android_minus.png')} />
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <View style={{backgroundColor: 'red'}}>
            <Vote
              stylePlusButtonImage={{width:30, height: 30}}
              dataSource={this.state.voteItemsDataSourceTmp}
              renderVoteItem={this._renderItem.bind(this)}
              createMode={this.state.createMode}
              onChangeTopic = {(text) => this.setState({topicTmp : text})}
              onChangeItem = {(text) => this.setState({voteItemTmp : text})}
              add={this._addItem.bind(this)}
              cancel={this._leaveModal.bind(this)}
              create={this._submit.bind(this)}
            />
          </View>
        </Modal>
        <View style={styles.container2}>
          <ListView
            dataSource={this.state.votesDataSource}
            renderRow={this._renderVote.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
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
  container2: {
    flex: 3,
    width: 400,
    backgroundColor: '#C5CAE9',
    padding: 10
  },
  profile: {
    flex : 1,
    flexDirection: 'row',
    padding : 10
  },
  text1: {
    flex: 5,
    color: '#fffff0',
    fontSize: 30,
    fontWeight: '600',
    backgroundColor: 'transparent'
  },
  button: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: '#303F9F',
    marginHorizontal: 5,
  },
  buttontext: {
    fontSize: 20,
    fontWeight: '600',
    width:100,
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
});

AppRegistry.registerComponent('VotePage', () => VotePage);

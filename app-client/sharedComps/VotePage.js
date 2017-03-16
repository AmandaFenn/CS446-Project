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
      voteIds : []
    }
    console.log(this.props.eventId)
  }

  componentWillMount() {
    this._loadVotesCallBack = this._loadVotesCallBack.bind(this)
    this._loadVotes()
  }

  componentWillUnmount() {
    this.state.votesRef.off('value', this._loadVotesCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
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

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.profile}>
        <Text style = {styles.text1}> {rowData.Name} </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <ListView
            dataSource={this.state.votesDataSource}
            renderRow={this._renderRow.bind(this)}
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

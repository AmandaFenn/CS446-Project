import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  ListView,
} from 'react-native';
import SharedVote from '../Modals/Vote';

export default class Vote extends SharedVote {
  constructor(props) {
    super(props)
  }
  
  _renderItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.profile}>
        <Text style = {styles.text1}> {rowData}: {this.state.voteItemScores[rowID]} </Text>
        <View style={{flex:1}}>
          {!this.props.createMode && <TouchableHighlight
            style={{width: 30, height: 30}}
            onPress={this._vote.bind(this, rowID)}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../img/like.png')} />
          </TouchableHighlight>}
        </View>  
        <View style={{flex:1}}>
          {!this.props.createMode && <TouchableHighlight
            style={{width: 30, height: 30}}
            onPress={this._undoVote.bind(this, rowID)}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../img/unlike.png')} />
          </TouchableHighlight>}
        </View>  
        <View style={{flex:1}}>
          <TouchableHighlight
            style={{width: 30, height: 30}}
            onPress={this._deleteItem.bind(this, rowID)}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../img/android_minus.png')} />
          </TouchableHighlight>
        </View>  
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1}}><Text style={{color:'blue'}}>Topic:</Text></View>
        <View style={{flex:1}}>
          <TextInput
            style={{flex:1}}
            placeholder={this.props.createMode ? 'Type event name' : ''}
            defaultValue={this.props.createMode ? '' : this.props.topic}
            onChangeText={(text) => this.setState({voteTopicTmp : text})}
            editable={this.props.createMode} />
        </View>
        <View style={{flex:1}}><Text style={{color:'blue'}}>Description:</Text></View>
        <View style={styles.list}>
          <ListView
            dataSource={this.state.voteItemsDataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>
        <View style={styles.buttons1}>
          <TextInput
            style={{flex:7}}
            placeholder='Add vote item.'
            onChangeText={(text) => this.setState({voteItemTmp : text})}
          />
          <TouchableHighlight
            style={{flex:1}}
            onPress={this._addItem.bind(this)}>
            <Image
              style={this.props.stylePlusButtonImage}
              source={require('../img/android_plus.png')} />
          </TouchableHighlight>
        </View>
        <View style={styles.buttons2}>
          <TouchableHighlight
            style={{flex:1}}
            onPress={this._leaveModal.bind(this)}>
            <Text style={{color: 'green'}}> Cancel </Text>
          </TouchableHighlight>
          {this.props.createMode && <TouchableHighlight
            style={{flex:1}}
            onPress={this._submit.bind(this)}>
            <Text style={{color:'green'}}> Create </Text>
          </TouchableHighlight>}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: 670
  },
  topic: {
    flex: 1
  },
  description: {
    flex: 1
  },
  list: {
    flex: 12
  },
  buttons1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profile: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding : 10
  },
  text1: {
    flex: 5,
    color: '#fffff0',
    fontSize: 30,
    fontWeight: '600',
    backgroundColor: 'transparent'
  },
});

AppRegistry.registerComponent('Vote', () => Vote);
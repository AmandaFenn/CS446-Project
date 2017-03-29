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
import {renderSeparator} from '../utils/HelpFuncs';

export default class Vote extends SharedVote {
  constructor(props) {
    super(props)
  }

  _renderItem(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}/>
        <View style={styles.topic}>
          <View style={{flex:2}}><Text style={styles.topictext}>Topic:</Text></View>
          <View style={{flex:7}}>
            <TextInput
              style={styles.topicinput}
              placeholder={this.props.createMode ? 'Type topic name' : ''}
              defaultValue={this.props.createMode ? '' : this.props.topic}
              onChangeText={(text) => this.setState({voteTopicTmp : text})}
              editable={this.props.createMode} />
          </View>
        </View>
        <View style={styles.list}>
          <ListView
            dataSource={this.state.voteItemsDataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            renderSeparator={renderSeparator}/>
        </View>
        <View style={styles.buttons1}>
          <TextInput
            style={styles.iteminput}
            placeholder='Add vote item.'
            onChangeText={(text) => this.setState({voteItemTmp : text})}
          />
          <TouchableHighlight
            style={{flex:1, alignItems: 'center'}}
            onPress={this._addItem.bind(this)}>
            <Image
              style={this.props.stylePlusButtonImage}
              source={require('../img/android_plus.png')} />
          </TouchableHighlight>
        </View>
        <View style={styles.buttons2}>
          <View style={{flex:1, alignItems: 'center'}}>
            <TouchableHighlight
              onPress={this._leaveModal.bind(this)}>
              <Text style={styles.buttontext}> {this.props.createMode? 'Cancel': 'Done'} </Text>
            </TouchableHighlight>
          </View>
          {this.props.createMode && <View style={{flex:1, alignItems: 'center'}}>
            <TouchableHighlight
              onPress={this._submit.bind(this)}>
              <Text style={styles.buttontext}> Create </Text>
            </TouchableHighlight>
          </View>}
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
    height: 670,
    padding: 5
  },
  topic: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    flex: 15,
  },
  buttons1: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iteminput: {
    flex: 7,
    fontSize: 30,
    fontWeight: '300',
    borderColor: '#add8e6',
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#e6e6fa'
  },
  buttons2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttontext: {
    fontSize: 25,
    fontWeight: '300',
    color:'rgba(5, 123, 253, 1.0)'
  },
  profile: {
    flex : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical : 5
  },
  topictext: {
    fontSize: 30,
    fontWeight: '300',
  },
  topicinput: {
    flex: 1,
    fontSize: 30,
    fontWeight: '300',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#d3d3d3'
  },
  text: {
    fontSize: 30,
    fontWeight: '600',
    backgroundColor: 'transparent'
  },
  count: {
    flex: 1,
    fontSize: 30,
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: 'red'
  },
  text1: {
    flex: 5,
    fontSize: 30,
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: 'blue'
  },
});

AppRegistry.registerComponent('Vote', () => Vote);

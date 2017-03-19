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
import {createListdataSource} from '../utils/HelpFuncs'
import ButtonWithIcon from '../Buttons/ButtonWithIcon'

export default class Vote extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1}}><Text style={{color:'blue'}}>Topic:</Text></View>
        <View style={{flex:1}}>
          <TextInput
            placeholder={this.props.createMode ?'Type event name' : ''}
            defaultValue={this.props.createMode ? '' : this.props.topic}
            onChangeText={this.props.onChangeTopic}
            editable={this.props.createMode} />
        </View>
        <View style={{flex:1}}><Text style={{color:'blue'}}>Description:</Text></View>
        <View style={styles.list}>
          <ListView
            dataSource={this.props.dataSource}
            renderRow={this.props.renderVoteItem}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>
        <View style={styles.buttons1}>
          <TextInput
            style={{flex:7}}
            placeholder='Add vote item.'
            onChangeText={this.props.onChangeItem}
          />
          <TouchableHighlight
            style={{flex:1}}
            onPress={this.props.add}>
            <Image
              style={this.props.stylePlusButtonImage}
              source={require('../img/android_plus.png')} />
          </TouchableHighlight>
        </View>
        <View style={styles.buttons2}>
          <TouchableHighlight
            style={{flex:1}}
            onPress={this.props.cancel}>
            <Text style={{color: 'green'}}> Cancel </Text>
          </TouchableHighlight>
          {this.props.createMode && <TouchableHighlight
            style={{flex:1}}
            onPress={this.props.create}>
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
});

AppRegistry.registerComponent('Vote', () => Vote);

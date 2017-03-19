import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  ListView
} from 'react-native';
import SharedSearchEvent from '../sharedComps/SearchEvent';
import EventPage from '../iOSComps/EventPage';

export default class SearchEvent extends SharedSearchEvent {
  constructor(props){
    super(props)
  }

  _onEvent(rowData, rowID) {
    this.props.navigator.push({
      component: EventPage,
      title: rowData,
      passProps: { 
        firebaseApp : this.props.firebaseApp,
        name : this.props.name,
        fbId : this.props.fbId,
        eventId : this.state.myeventIds[rowID]
      }
    });
  }
  
  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight onPress = {this._onEvent.bind(this, rowData, rowID)}>
        <Text style = {styles.text} 
          numberOfLines={1}> 
          {rowData} 
        </Text>
      </TouchableHighlight>
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <TextInput
            style={styles.textinput}
            placeholder="Type event name."
            onChangeText={(text) => this.setState({name : text})}
          />
          <TouchableHighlight onPress = {this._onSearch.bind(this)}>
            <Text style={styles.button}> Search </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container2}>
          <ListView 
            dataSource={this.state.searchEvents}
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
    paddingTop: 60,
    paddingBottom:10,
  },
  container1: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textinput: {
    height: 45,
    fontSize: 30,
    paddingHorizontal: 5
  },
  container2: {
    flex: 3,
    width: 360,
    backgroundColor: '#C5CAE9',
    paddingHorizontal: 5
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    width: 200,
    color: '#fffff0',
    backgroundColor: '#303F9F',
    textAlign: 'center',
    paddingVertical:10
  },
  text: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '600',
    backgroundColor: 'transparent',
  }
});

AppRegistry.registerComponent('SearchEvent', () => SearchEvent);

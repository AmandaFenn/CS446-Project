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
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import * as firebase from 'firebase';

import EventPage from '../iOSComps/EventPage';

export default class SearchEvent extends Component {
  constructor(props){
    super(props)
    this.state = {
      name : '',
      fbId : 0,
      searchEvents: this._createListdataSource([]),
      searchEventIds: [],
      eventsRef : this.props.firebaseApp.database().ref('Events/'),
    }
  }
  
  componentWillMount() {
    this._searchEventsCallBack = this._searchEventsCallBack.bind(this)
    this.state.eventsRef.on('value', this._searchEventsCallBack, function(error) {
      console.error(error);
    });
  }
  
  componentWillUnmount() {
    this.state.eventsRef.off('value', this._searchEventsCallBack);
  }
  
  _onBack() {
    this.props.navigator.pop();
  }
  
  _createListdataSource(array) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(array)
  }
  
  _searchEventsCallBack(snapshot) {
    var events = []
    var eventIds = []
    var fbId = this.state.fbId.toString()
    var searchName = this.state.name
    snapshot.forEach(function(data) {
      var dataVal = data.val()
      if (searchName != '' && dataVal.Name.includes(searchName)) {
        events.push(dataVal.Name)
        eventIds.push(data.key)
      }
    });
    this.setState({ 
      searchEvents: this._createListdataSource(events),
      myeventIds: eventIds
    });
  }
  
  _onSearch() {
    this.state.eventsRef.once('value').then(this._searchEventsCallBack.bind(this))
  }
  
  _onEvent(rowData, rowID) {
    this.props.navigator.push({
      component: EventPage,
      title: rowData,
      passProps: { 
        firebaseApp : this.props.firebaseApp,
        name : this.state.name,
        fbId : this.state.fbId,
        eventId : this.state.myeventIds[rowID]
      }
    });
    //console.log(this.state.myeventIds[rowID])
  }
  
  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight onPress = {this._onEvent.bind(this, rowData, rowID)}>
        <Text style = {styles.text}> {rowData} </Text>
      </TouchableHighlight>
    )
  }
  
  render() {
    return (
      <Image source={require('../img/menu.jpg')} style={styles.container}>
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
      </Image>
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
    backgroundColor: 'purple'
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    width: 200,
    color: '#fffff0',
    backgroundColor: '#008080',
    textAlign: 'center',
    paddingVertical:10
  },
  text: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '600',
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('SearchEvent', () => SearchEvent);
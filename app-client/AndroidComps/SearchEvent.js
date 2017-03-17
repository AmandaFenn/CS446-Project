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

export default class SearchEvent extends Component {
  constructor(props){
    super(props)
    this.state = {
      name : '',
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
      title : rowData,
      index : 3,
      name : this.props.route.name,
      fbId : this.props.route.fbId,
      eventId : this.state.myeventIds[rowID]
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight onPress = {this._onEvent.bind(this, rowData, rowID)}>
        <Text style = {styles.text} numberOfLines={1}> {rowData} </Text>
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
    paddingTop: 80,
    paddingBottom:10,
  },
  container1: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textinput: {
    height: 60,
    width: 300,
    fontSize: 30,
  },
  container2: {
    flex: 3,
    width: 400,
    backgroundColor: '#C5CAE9'
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
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('SearchEvent', () => SearchEvent);

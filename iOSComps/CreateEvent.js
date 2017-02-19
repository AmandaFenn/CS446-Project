import React, { Component, } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  DatePickerIOS,
  PickerIOS
} from 'react-native';

export default class CreateEvent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name : '',
      description : '',
      location : '',
      date: new Date(),
    }
  }
  
  _onBack() {
    this.props.navigator.pop();
  }

  _checkInfo() {
    var check = false
    var checkInfo = ''
    if (this.state.name == '') {
      check = true
      checkInfo += 'Please enter the event name!\n'
    }
    
    if (this.state.location == '') {
      check = true
      checkInfo += 'Please enter the event location!\n'
    }
    
    if (check) {
      alert(checkInfo)
    }
    return check
  }
  
  _createEvent() {
    var eventlistRef = this.props.firebaseApp.database().ref('Events/').push()
    eventlistRef.set({
      'Name': this.state.name,
      'Date': this.state.date.toLocaleString(),
      'Location': this.state.location,
      'Description': this.state.description,
    })
    var addHost = {};
    var hostData = {
       'Name': this.props.name,
       'Host': true,
       'Status': 0
    }
    var newPostKey = eventlistRef.key
    addHost['/Events/' + newPostKey + '/Participants/' + this.props.fbId] = hostData;
    this.props.firebaseApp.database().ref().update(addHost)
  }
  
  _submit() {
    if (!this._checkInfo()) {
      this._createEvent()
      this._onBack()
    }
  }
  
  onDateChange = (date) => {
    this.setState({date: date});
  };
  
  render() {
    return (
      <View style={styles.background}>
        <TextInput
          style={{height: 40}}
          placeholder="Type event name."
          onChangeText={(text) => this.setState({name : text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Type event description!"
          onChangeText={(text) => this.setState({description : text})}
        />
        <TextInput
          style={{height: 40}}
          placeholder="Type event location"
          onChangeText={(text) => this.setState({location : text})}
        />
        <DatePickerIOS style={styles.date}
          date={this.state.date}
          mode="datetime"
          minimumDate = {new Date()}
          onDateChange={this.onDateChange}
        />
        <TouchableHighlight onPress={this._submit.bind(this)}>
          <Text style={styles.button}> Create </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex:1,
    width: null,
    height: null,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom:100,
    paddingTop: 100,
    backgroundColor: 'purple'
  },
  date: {
    flex: 1,
    width: 400,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fffff0',
    backgroundColor: '#008080',
    padding:10
  },
});

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);
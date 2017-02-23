import React, { Component, } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  DatePickerAndroid,
  TimePickerAndroid,
  Picker,
  ScrollView
} from 'react-native';

export default class CreateEvent extends Component {
  constructor(props) {
    super(props)
    var date = new Date()
    date.setSeconds(0)
    this.state = {
      name : '',
      description : '',
      location : '',
      date: date,
    }
    console.log('fbid---------------------------------' + this.props.route.fbId)
  }

  _onBack() {
    if (this.props.route.index > 0) {
      this.props.navigator.pop();
    }
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
      'Date': this.state.date.toLocaleDateString(),
      'Time': this.state.date.toLocaleTimeString(),
      'Location': this.state.location,
      'Description': this.state.description,
    })
    var addHost = {};
    var hostData = {
       'Name': this.props.route.name,
       'Host': true,
       'Status': 0
    }
    var newPostKey = eventlistRef.key
    addHost['/Events/' + newPostKey + '/Participants/' + this.props.route.fbId] = hostData;
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

  async _showDatePicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.date, minDate: new Date(), mode: 'default'});
      if (action === DatePickerAndroid.dismissedAction) {
      } else {
        var date = this.state.date
        date.setYear(year)
        date.setMonth(month)
        date.setDate(day)
        this.setState({date: date});
      }

    } catch ({code, message}) {
      console.warn(`Error in setting date: `, message);
    }
  };

  async _showTimePicker() {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open({is24Hour:false, hour: this.state.date.getHours(), minute: this.state.date.getMinutes()});
      if (action === TimePickerAndroid.timeSetAction) {
        var date = this.state.date
        date.setMinutes(minute)
        date.setHours(hour)
        date.setSeconds(0)
        this.setState({date : date})
      }
    } catch ({code, message}) {
      console.warn(`Error in setting time: `, message);
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.emptyview}><Text style={styles.title}>Name:</Text></View>
        <View style={styles.textinputview}>
          <TextInput style={styles.textinput}
            placeholder="Type event name"
            onChangeText={(text) => this.setState({name : text})}
            />
        </View>

        <View style={styles.emptyview}><Text style={styles.title}>Date and Time:</Text></View>

        <View style={styles.datetime}>
          <TouchableHighlight
            onPress={this._showDatePicker.bind(this)}>
            <Text style={styles.text}>{this.state.date.toLocaleDateString()}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this._showTimePicker.bind(this)}>
            <Text style={styles.text}>{this.state.date.toLocaleTimeString()}</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.emptyview}><Text style={styles.title}>Location:</Text></View>

        <View style={styles.textinputview}>
          <TextInput
            style = {styles.textinput}
            placeholder="Type event location"
            onChangeText={(text) => this.setState({location : text})}
            />
        </View>

        <View style={styles.emptyview}><Text style={styles.title}>Description:</Text></View>

        <TextInput
          style = {styles.textinput1}
          placeholder = "Type event description"
          onChangeText = {(text) => this.setState({description : text})}
          multiline={true}
          underlineColorAndroid = 'transparent'
        />

        <View style={styles.emptyview} />

        <TouchableHighlight
          style={styles.button}
          onPress={this._submit.bind(this)}>
          <Text style={styles.buttontext}> Create </Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    paddingTop: 80,
    paddingHorizontal: 5
  },
  emptyview: {
    height: 40
  },
  title: {
    fontSize:30,
    color:'deepskyblue'
  },
  textinputview: {
    backgroundColor: 'white',
  },
  textinput: {
    height: 45,
    fontSize: 30,
    padding: 5
  },
  textinput1: {
    height: 150,
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: 'white',
    fontSize: 30,
    padding: 5
  },
  datetime: {
    flex:1,
    flexDirection:'row'
  },
  text: {
    color: 'grey',
    fontSize: 30,
    padding: 5
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 100,
    backgroundColor: 'lightgray',
  },
  buttontext: {
    fontSize: 30,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    paddingVertical:10,
  },
});

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);

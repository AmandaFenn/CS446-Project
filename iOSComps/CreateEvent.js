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
  PickerIOS,
  Switch,
  ScrollView,
} from 'react-native';

var numbers = Array.apply(null, {length: 1000}).map(Number.call, Number)
numbers.shift()

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
      unlimited: true,
      limited: 1,
      datePickerVisible: false,
      numberPickerVisible: false,
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
      'Date': this.state.date.toLocaleDateString(),
      'Time': this.state.date.toLocaleTimeString(),
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

  _onDatePress() {
    this.setState({datePickerVisible: !this.state.datePickerVisible});
  }
    
  _onNumberPress() {
    this.setState({numberPickerVisible: !this.state.numberPickerVisible});
  }
  
  _onSwitch(value) {
    this.setState({unlimited: value})
      if (value) {
        this.setState({numberPickerVisible: false})
      }
  }
  
  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.emptyview}><Text style={styles.title}>Name:</Text></View>
        <View style={styles.textinputview}>
          <TextInput style={styles.textinput}
            placeholder="Type event name."
            onChangeText={(text) => this.setState({name : text})}
          />
        </View>  
        <View style={styles.emptyview}><Text style={styles.title}>Date and Time:</Text></View>
        <View>
          <TouchableHighlight 
            style={styles.datetime}
            onPress={this._onDatePress.bind(this)}
            underlayColor = 'lightgray'>
            <Text style={styles.text}> {this.state.date.toLocaleString()} </Text>
          </TouchableHighlight>
          {this.state.datePickerVisible && <DatePickerIOS style={styles.date}
            date={this.state.date}
            mode="datetime"
            minimumDate = {new Date()}
            onDateChange={this.onDateChange}
          />}
        </View>  
        <View style={styles.emptyview}><Text style={styles.title}>Location:</Text></View>
        <View style={styles.textinputview}>
          <TextInput
            style={styles.textinput}
            placeholder="Type event location"
            onChangeText={(text) => this.setState({location : text})}
          />
        </View>  
        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Unlimited number of people
          </Text>
          <Switch
            onValueChange={this._onSwitch.bind(this)}
            style={{marginTop: 5}}
            value={this.state.unlimited} />
        </View>
        
        {!this.state.unlimited && 
          <TouchableHighlight 
            style={styles.emptyview}
            onPress={this._onNumberPress.bind(this)}
            underlayColor = 'lightgray'>
            <Text style={styles.text1}> {'Number of people: ' + this.state.limited} </Text>           
          </TouchableHighlight>
        }
        
        {this.state.numberPickerVisible && !this.state.unlimited &&
        <PickerIOS
          selectedValue = {this.state.limited}
          onValueChange={(value) => this.setState({limited : value})}>
          {numbers.map((n) => (
            <PickerIOS.Item
              key= 'key'
              value= {n}
              label= {n.toString()}
            />
          ))}
        </PickerIOS>
        }
        <View style={styles.emptyview}><Text style={styles.title}>Description:</Text></View>
        <TextInput
          style={styles.textinput1}
          placeholder="Type event description!"
          onChangeText={(text) => this.setState({description : text})}
          multiline={true}
        />
        <View style={styles.emptyview} />
        <TouchableHighlight
          style={styles.button}
          onPress={this._submit.bind(this)}>
          <Text style={styles.buttontext}> Create </Text>
        </TouchableHighlight>
        <View style={styles.emptyview} />
        <View style={styles.emptyview} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    paddingHorizontal: 5,
    //paddingTop: 40,
  },
  emptyview: {
    height: 40,
  },
  title: {
    fontSize:20,
    color:'rgba(5, 123, 253, 1.0)',
    paddingTop: 10
  },
  textinputview: {
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },
  textinput: {
    height: 30,
    fontSize: 20,
    padding: 5
  },
  textinput1: {
    height: 180,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    fontSize: 25,
    padding: 5
  },
  datetime: {
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white'
  },
  text: {
    color: 'grey',
    fontSize: 25,
    padding: 10
  },
  text1: {
    fontSize: 20,
    paddingTop: 10
  },
  unlimited: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  button: {
    alignItems: 'center',  
    marginHorizontal: 100,
    backgroundColor: '#303F9F',
  },
  buttontext: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fffff0',
    textAlign: 'center',
    paddingVertical:6,
  },
});

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);

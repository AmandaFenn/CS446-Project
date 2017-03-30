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
  Switch,
  ScrollView,
  Modal,
} from 'react-native';
import SharedCreateEvent from '../sharedComps/CreateEvent';
import GeoLocation from './GeoLocation'
import Constants from '../utils/Constants'

var numbers = Array.apply(null, {length: 1000}).map(Number.call, Number)
numbers.shift()

export default class CreateEvent extends SharedCreateEvent {
  constructor(props) {
    super(props)
  }

  _updateNav() {
    this.props.route.RightButtonTitle = 'Create'
    this.props.route.RightButtonPress = this._submit.bind(this)
  }

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
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}>
          <GeoLocation
            region = {this.state.region}
            markerCoordinate = {this.state.GeoCoordinate}
            modalParent = {this}
          />
        </Modal>

        <Image
          source={this.state.avatarSource}
          style = {{width:400, height:100}}
          resizeMode={Image.resizeMode.stretch}
        />

        <View style={styles.location}>
          <View style={{flex: 2}}><Text style={styles.title}>Name:</Text></View>
          <View style={{flex: 8}}>
            <TextInput style={styles.inputField}
              placeholder="Event Name"
              onChangeText={(text) => this.setState({name : text})}/>
          </View>
          <View style={{flex: 1}}>
            <TouchableHighlight
              style={{width: 40, height:40}}
              onPress={this._onImage.bind(this)}
              underlayColor = 'lightgray'>
              <Image
                style={{width: 40, height:40}}
                source={require('../img/GoogleImages.png')} />
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.spacing}/>

        <View><Text style={styles.title}>Date and time:</Text></View>
        <View style={styles.datetimecontainer}>
          <TouchableHighlight
            onPress={this._showDatePicker.bind(this)}>
            <Text style={styles.inputField}>{this.state.date.toLocaleDateString()}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this._showTimePicker.bind(this)}>
            <Text style={[styles.timeStyle, styles.inputField]}>{this.state.date.toLocaleTimeString()}</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.spacing}/>

        <View><Text style={styles.title}>Location:</Text></View>
        <View style={styles.location}>

          <View style={{flex: 7}}>
            <TextInput
              style = {styles.inputField}
              placeholder="Type event location"
              onChangeText={(text) => this.setState({location : text})}
              />
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableHighlight
              style={{width: 40, height:40}}
              onPress={this._onGeoMap.bind(this)}
              underlayColor = 'lightgray'>
              <Image
                style={{width: 40, height:40}}
                source={require('../img/GoogleMap.png')} />
            </TouchableHighlight>
          </View>
        </View>

        <View style={styles.spacing}/>

        <View style = {styles.location}>
          <View style={{flex: 4}}><Text style={styles.title}>Category:</Text></View>
          <View style={[{flex: 10, justifyContent: 'center'}, styles.category]}>
            <Picker
              selectedValue = {this.state.type}
              onValueChange={(value) => this.setState({type : value})}>
              {Constants.eventTypes.map((e) => (
                <Picker.Item
                  key= 'key'
                  value= {e}
                  label= {e}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.spacing}/>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Private event</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchPrivate.bind(this)}
              value={this.state.private} />
          </View>
        </View>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Guests can vote</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchVote.bind(this)}
              style={{marginTop: 5}}
              value={this.state.guestVote} />
          </View>
        </View>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Unlimited event capacity</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchCap.bind(this)}
              style={{marginTop: 5}}
              value={this.state.unlimited} />
          </View>
        </View>

        {!this.state.unlimited &&
          <View style = {styles.location}>
            <View style={{flex: 3}}><Text style={styles.title}>Number of people:</Text></View>
            <View style={[{flex: 4, justifyContent: 'center'}, styles.category]}>
              <Picker
                selectedValue = {this.state.limited}
                onValueChange={(value) => this.setState({limited : value})}>
                {numbers.map((n) => (
                  <Picker.Item
                    key= 'key'
                    value= {n}
                    label= {n.toString()}
                  />
                ))}
              </Picker>
            </View>
          </View>
        }

        <View style={styles.spacing}/>

        <View style={styles.emptyview}><Text style={styles.title}>Description:</Text></View>
        <TextInput
          style={styles.inputField}
          placeholder = "Event Description"
          onChangeText = {(text) => this.setState({description : text})}
          multiline={true}
          underlineColorAndroid = 'transparent'
        />

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingHorizontal: 5,
    paddingTop: 60,
    margin: 15,
  },
  emptyview1: {
    width: 400
  },
  title: {
    fontSize:20,
    color:'rgba(5, 123, 253, 1.0)',
  },
  location: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40
  },
  number: {
    height: 40,
    width: 400,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white'
  },
  textinputview: {
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },
  textinput: {
    height: 40,
    fontSize: 20,
    padding: 5
  },
  description: {
    height: 160,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    fontSize: 25,
    padding: 5,
    width: 400
  },
  datetimecontainer: {
    flexDirection: 'row',
  },
  datetime: {
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    alignItems: 'center',
    width: 200,
    height: 40
  },
  text: {
    color: 'grey',
    fontSize: 25,
    padding: 5
  },
  guest: {
    fontSize:30,
    fontWeight: '300',
  },
  inputField: {
    fontWeight: '300',
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 20,
  },
  timeStyle: {
    marginLeft: 10
  },
  spacing: {
    height: 20,
  },
  category: {
    borderRadius: 4,
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    height: 40
  }
});

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);

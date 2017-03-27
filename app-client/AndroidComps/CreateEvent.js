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
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}>
          <GeoLocation
            region = {this.state.region}
            markerCoordinate = {this.state.GeoCoordinate}
            modalParent = {this}
          />
        </Modal>
        <View style={styles.emptyview}><Text style={styles.title}>Name:</Text></View>
        <View style={styles.textinputview}>
          <TextInput style={styles.textinput}
            placeholder="Type event name"
            onChangeText={(text) => this.setState({name : text})}
            />
        </View>

        <Image
          source={this.state.avatarSource}
          style = {{width:400, height:100}}
          resizeMode={Image.resizeMode.stretch}/>

        <TouchableHighlight
          style={{width: 40, height:40}}
          onPress={this._onImage.bind(this)}
          underlayColor = 'lightgray'>
          <Image
            style={{width: 40, height:40}}
            source={require('../img/GoogleImages.png')} />
        </TouchableHighlight>

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

        <TouchableHighlight
          style={{width: 40, height:40}}
          onPress={this._onGeoMap.bind(this)}
          underlayColor = 'lightgray'>
          <Image
            style={{width: 40, height:40}}
            source={require('../img/GoogleMap.png')} />
        </TouchableHighlight>

        <View style={styles.datetime}>
          <View style={styles.emptyview}><Text style={styles.title}>Type:</Text></View>
          <Picker
            style={styles.emptyview, {width: 350}}
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

        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Private
          </Text>
          <Switch
            onValueChange={this._onSwitchPrivate.bind(this)}
            style={{marginTop: 5}}
            value={this.state.private} />
        </View>

        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Guests can create votes
          </Text>
          <Switch
            onValueChange={this._onSwitchVote.bind(this)}
            style={{marginTop: 5}}
            value={this.state.guestVote} />
        </View>

        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Unlimited number of people
          </Text>
          <Switch
            onValueChange={this._onSwitchCap.bind(this)}
            style={{marginTop: 5}}
            value={this.state.unlimited} />
        </View>

        {!this.state.unlimited &&
          <View style={styles.datetime}>
            <View style={styles.emptyview}><Text style={styles.title}>Number of people: </Text></View>
            <Picker
              style={styles.emptyview, {width: 60}}
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
        }

        <View style={styles.emptyview}><Text style={styles.title1}>Description:</Text></View>

        <TextInput
          style = {styles.description}
          placeholder = "Type event description"
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
    backgroundColor: 'ghostwhite',
    paddingTop: 60,
    paddingHorizontal: 5
  },
  emptyview: {
    height: 40
  },
  title: {
    fontSize:20,
    color:'#455A64',
    paddingTop: 10
  },
  title1: {
    fontSize:20,
    color:'#455A64',
  },
  textinputview: {
    backgroundColor: 'white',
  },
  textinput: {
    height: 30,
    fontSize: 20,
    padding: 5
  },
  description: {
    height: 120,
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: 'white',
    fontSize: 25,
    padding: 5
  },
  datetime: {
    flex:1,
    flexDirection:'row'
  },
  text: {
    color: 'grey',
    fontSize: 25,
    paddingHorizontal:10,
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
    backgroundColor: 'lightgray',
  },
  buttontext: {
    fontSize: 25,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    paddingVertical:6,
  },
});

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);

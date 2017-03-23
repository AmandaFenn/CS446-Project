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
    this.props.navigator.replace({
      component: CreateEvent,
      title: 'New Event',
      rightButtonTitle: 'Create',
      onRightButtonPress: this._submit.bind(this),
      passProps: {
        firebaseApp : this.props.firebaseApp,
        name : this.props.name,
        fbId : this.props.fbId
      }
    });
  }

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
        <TouchableHighlight
          style={{width: 40, height:40}}
          onPress={this._onGeoMap.bind(this)}
          underlayColor = 'lightgray'>
          <Image
            style={{width: 40, height:40}}
            source={require('../img/GoogleMap.png')} />
        </TouchableHighlight>

        <View style={styles.emptyview}><Text style={styles.title}>Type:</Text></View>
        <TouchableHighlight
          style={styles.typeandnumber}
          onPress={this._onTypePress.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.text1}> {this.state.type} </Text>
        </TouchableHighlight>

        {this.state.typePickerVisible && <PickerIOS
          selectedValue = {this.state.type}
          onValueChange={(value) => this.setState({type : value})}>
          {Constants.eventTypes.map((e) => (
            <PickerIOS.Item
              key= 'key'
              value= {e}
              label= {e}
            />
          ))}
        </PickerIOS>}

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
            Vote allowed
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
          <TouchableHighlight
            style={styles.typeandnumber}
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
        </PickerIOS>}

        <View style={styles.emptyview}><Text style={styles.title}>Description:</Text></View>
        <TextInput
          style={styles.description}
          placeholder="Type event description!"
          onChangeText={(text) => this.setState({description : text})}
          multiline={true}
        />
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
    height: 40,
    fontSize: 20,
    padding: 5
  },
  description: {
    height: 120,
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
    padding: 5
  },
  typeandnumber: {
    height: 40,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white'
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

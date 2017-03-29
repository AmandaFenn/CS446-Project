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
      passProps: this.props
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
        {this.state.avatarSource && <Image
          source={this.state.avatarSource}
          style = {{width:360, height:100}}
          resizeMode={Image.resizeMode.stretch}/>
        }

        <View style = {{height:5}}/>

        <View style={styles.location}>
          <View style={{flex: 2}}><Text style={styles.title}>Name:</Text></View>
          <View style={{flex: 8}}>
            <TextInput style={styles.locationtextinput}
              placeholder="Type event name."
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

        <View style={styles.emptyview}><Text style={styles.title}>Date and Time:</Text></View>
        <View style = {styles.emptyview1}>
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

        <View style = {{height:5}}/>

        <View style={styles.location}>
          <View style={{flex: 2}}><Text style={styles.title}>Location:</Text></View>
          <View style={{flex: 5}}>
            <TextInput
              style={styles.locationtextinput}
              placeholder="Type location"
              onChangeText={(text) => this.setState({location : text})}/>
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

        <View style = {{height:5}}/>

        <View style = {styles.location}>
          <View style={{flex: 3}}><Text style={styles.title}>Category:</Text></View>
          <View style={{flex: 8}}>
            <TouchableHighlight
              style={styles.type}
              onPress={this._onTypePress.bind(this)}
              underlayColor = 'lightgray'>
              <Text style={styles.guest}> {this.state.type} </Text>
            </TouchableHighlight>
          </View>
        </View>

        {this.state.typePickerVisible && <View style = {styles.emptyview1}>
          <PickerIOS
            selectedValue = {this.state.type}
            onValueChange={(value) => this.setState({type : value})}>
            {Constants.eventTypes.map((e) => (
              <PickerIOS.Item
                key= 'key'
                value= {e}
                label= {e}
              />
            ))}
          </PickerIOS>
        </View>}

        <View style = {{height:5}}/>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Private</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchPrivate.bind(this)}
              value={this.state.private} />
          </View>
        </View>

        <View style = {{height:5}}/>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Guests can create votes</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchVote.bind(this)}
              value={this.state.guestVote} />
          </View>
        </View>

        <View style = {{height:5}}/>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Unlimited number of people</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchCap.bind(this)}
              value={this.state.unlimited} />
          </View>
        </View>

        {!this.state.unlimited &&
          <TouchableHighlight
            style={styles.number}
            onPress={this._onNumberPress.bind(this)}
            underlayColor = 'lightgray'>
            <Text style={styles.guest}> {'Number of people: ' + this.state.limited} </Text>
          </TouchableHighlight>
        }

        {this.state.numberPickerVisible && !this.state.unlimited && <View style = {styles.emptyview1}>
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
        </View>}

        <View style={styles.emptyview}><Text style={styles.title}>Description:</Text></View>
        <TextInput
          style={styles.description}
          placeholder="Type event description!"
          onChangeText={(text) => this.setState({description : text})}
          multiline={true}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  emptyview: {
    width: 360,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyview1: {
    width: 360
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
  locationtextinput: {
    flex: 1,
    fontSize: 30,
    fontWeight: '300',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
  },
  type: {
    borderColor: 'grey',
    borderWidth: 1,
    backgroundColor: 'white',
    height: 40
  },
  number: {
    height: 40,
    width: 360,
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
  guest: {
    fontSize:30,
    fontWeight: '300',
  },
});

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);

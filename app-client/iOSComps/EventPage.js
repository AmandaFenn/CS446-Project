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
  ListView
} from 'react-native';
import SharedEventPage from '../sharedComps/EventPage';
import GuestList from '../iOSComps/GuestList';
import SuggestMap from '../iOSComps/SuggestMap';
import VotePage from '../iOSComps/VotePage';
import Constants from '../utils/Constants'

export default class EventPage extends SharedEventPage {
  constructor(props) {
    super(props)
  }

  _updateNav(host) {
    this.props.navigator.replace({
      component: EventPage,
      title: this.props.title,
      rightButtonTitle: host ? 'Done' : '',
      onRightButtonPress: host ? this._submit.bind(this) : null,
      passProps: this.props
    });
  }

  _onSuggest() {
    this.props.navigator.push({
      component: SuggestMap,
      title: 'Map',
      leftButtonTitle: 'Back',
      onLeftButtonPress: ()=>{this.props.navigator.pop()},
      passProps: {
        firebaseApp : this.props.firebaseApp,
        eventRef: this.state.eventRef,
        fbId : this.props.fbId,
        eventId : this.props.eventId,
        GeoCoordinate: this.state.GeoCoordinate
      }
    });
  }

  _onVote() {
    this.props.navigator.push({
      component: VotePage,
      title: 'Votes',
      passProps: {
        firebaseApp : this.props.firebaseApp,
        fbId : this.props.fbId,
        host: this.state.host,
        eventId : this.props.eventId,
        guestVote: this.state.guestVote
      }
    });
  }

  _guest() {
    this.props.navigator.push({
      component: GuestList,
      title: 'Guests',
      leftButtonTitle: 'Back',
      onLeftButtonPress: ()=>{this.props.navigator.pop()},
      passProps: {
        firebaseApp : this.props.firebaseApp,
        fbId : this.props.fbId,
        eventId : this.props.eventId,
        guest: true,
        host: this.state.host
      }
    });
  }

  _friend() {
    this.props.navigator.push({
      component: GuestList,
      title : 'Friends',
      leftButtonTitle: 'Back',
      onLeftButtonPress: ()=>{this.props.navigator.pop()},
      passProps: {
        firebaseApp : this.props.firebaseApp,
        fbId : this.props.fbId,
        eventId : this.props.eventId,
        guest: false,
        host: this.state.host
      }
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.emptyview}><Text style={styles.title}>Description:</Text></View>
        <TextInput
          style={styles.description}
          placeholder="Type event description!"
          defaultValue={this.state.description}
          onChangeText={(text) => this.setState({description : text, descriptionModified:true})}
          multiline={true}
          editable={this.state.host}
        />

        <View style={styles.location}>
          {!this.state.host && <TouchableHighlight
            style={styles.button1}
            onPress={this.state.member ? this._onLeave.bind(this) : this._onJoin.bind(this)}>
            <Text style={styles.buttontext1}> {this.state.member ? 'Leave' : 'Join'} </Text>
          </TouchableHighlight>}

          {this.state.host &&
          <TouchableHighlight
            style={styles.button1}
            onPress={this._friend.bind(this)}>
            <Text style={styles.buttontext1}> Invite </Text>
          </TouchableHighlight>}

          <TouchableHighlight
            style={styles.button1}
            onPress={this._onSuggest.bind(this)}>
            <Text style={styles.buttontext1}> Suggest </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.button1}
            onPress={this._onVote.bind(this)}>
            <Text style={styles.buttontext1}> Vote </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.emptyview}><Text style={styles.title1}>Type: {this.state.private ? 'Private' : 'Public'}</Text></View>
        <View style={styles.emptyview}><Text style={styles.title}>Date and Time:</Text></View>

        <View>
          <TouchableHighlight
            style={styles.datetime}
            onPress={this._onDatePress.bind(this)}
            underlayColor = 'lightgray'>
            <Text style={styles.text}> {this.state.date.toLocaleString()} </Text>
          </TouchableHighlight>
          {this.state.datePickerVisible && this.state.host &&
          <DatePickerIOS style={styles.date}
            date={this.state.date}
            mode="datetime"
            minimumDate = {new Date()}
            onDateChange={this.onDateChange}
          />}
        </View>

        <View style={styles.emptyview}><Text style={styles.title}>Location:</Text></View>

        <TextInput
          style={styles.typeandnumber}
          placeholder="Type event location"
          defaultValue={this.state.location}
          onChangeText={(text) => this.setState({location : text, locationModified: true})}
          editable={this.state.host}
        />

        <View style={styles.emptyview}><Text style={styles.title}>Category:</Text></View>
        <TouchableHighlight
          style={styles.typeandnumber}
          onPress={this._onTypePress.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.guest}> {this.state.type} </Text>
        </TouchableHighlight>

        {this.state.typePickerVisible && this.state.host &&
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
        </PickerIOS>}

        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Vote allowed
          </Text>
          <Switch
            onValueChange={this._onSwitchVote.bind(this)}
            style={{marginTop: 5}}
            value={this.state.guestVote}
            disabled={!this.state.host} />
        </View>

        <TouchableHighlight
          style={styles.typeandnumber}
          onPress={this._guest.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.guest}> Guests: {this.state.guests} </Text>
        </TouchableHighlight>

        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Unlimited number of people
          </Text>
          <Switch
            onValueChange={this._onSwitchCap.bind(this)}
            style={{marginTop: 5}}
            value={this.state.unlimited}
            disabled={!this.state.host} />
        </View>

        {!this.state.unlimited &&
          <TouchableHighlight
            style={styles.emptyview}
            onPress={this._onNumberPress.bind(this)}
            underlayColor = 'lightgray'>
            <Text style={styles.guest}> {'Number of people: ' + this.state.limited} </Text>
          </TouchableHighlight>
        }

        {this.state.numberPickerVisible && !this.state.unlimited &&
        <PickerIOS
          selectedValue = {this.state.limited}
          onValueChange={(value) => this.setState({limited: value, capModified:true})}>
          {this.state.numbers.map((n) => (
            <PickerIOS.Item
              key= 'key'
              value= {n}
              label= {n.toString()}
            />
          ))}
        </PickerIOS>
        }

        <View style={styles.emptyview}><Text style={styles.title}>Comments:</Text></View>

        <View style={styles.comments}>
          <ListView
            dataSource={this.state.comments}
            renderRow={(rowData) => <Text style = {styles.commenttext}>{rowData}</Text>}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>

        <View style={styles.emptyview} />

        {this.state.host && <TouchableHighlight
          style={styles.typeandnumber}
          onPress={this._deleteEvent.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.buttontext2}> Delete </Text>
        </TouchableHighlight>}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    paddingHorizontal: 5
  },
  emptyview: {
    height: 40,
  },
  title: {
    fontSize: 20,
    color:'rgba(5, 123, 253, 1.0)',
    paddingTop:10
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
  location: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  buttontext: {
    fontSize: 20,
    fontWeight: '300',
    color: 'black',
    textAlign: 'center',
    paddingVertical:6,
  },
  button1: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  buttontext1: {
    fontSize: 15,
    fontWeight: '300',
    width:80,
    color: 'black',
    textAlign: 'center',
    paddingVertical:5,
  },
  textinput: {
    height: 40,
    fontSize: 20,
    paddingHorizontal: 5
  },
  comments: {
    width: 360,
    backgroundColor: '#C5CAE9',
    paddingHorizontal: 5
  },
  commenttext: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '300',
    backgroundColor: 'transparent'
  },
  guest: {
    fontSize:20,
    paddingTop: 10
  },
  buttonlayout: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button2: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  buttontext2: {
    fontSize: 15,
    fontWeight: '300',
    color: 'red',
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
  unlimited: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

AppRegistry.registerComponent('EventPage', () => EvengPage);

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
  ListView
} from 'react-native';
import SharedEventPage from '../sharedComps/EventPage';

const eventTypes = ['Restaurants', 'Coffee', 'Bar', 'Movie', 'Sports', 'Casino', 'Others']

export default class EvengPage extends SharedEventPage {
  constructor(props) {
    super(props)
  }

  _updateNav(host) {
    this.props.route.RightButtonTitle = host ? 'Done' : null
    this.props.route.RightButtonPress = host ? this._submit.bind(this) : null
  }

  _onSuggest() {
    this.props.navigator.push({
      title: 'Map',
      index: 6,
      passProps: {
        eventRef: this.state.eventRef,
        fbId : this.props.fbId,
        eventId : this.props.eventId,
        guest: true
      }
    });
  }

  _onVote() {
    this.props.navigator.push({
      title: 'Votes',
      index: 7,
      passProps: {
        fbId : this.props.fbId,
        eventId : this.props.eventId,
      }
    });
  }

  _guest() {
    this.props.navigator.push({
      title : 'Guests',
      index : 4,
      passProps: {
        fbId : this.props.fbId,
        eventId : this.props.eventId,
        guest: true,
        host: this.state.host
      }
    });
  }

  _friend() {
    this.props.navigator.push({
      title : 'Friends',
      index : 4,
      passProps: {
        fbId : this.props.fbId,
        eventId : this.props.eventId,
        guest: false,
        host: this.state.host
      }
    });
  }

  _doNothing() {
    console.log('do nothing')
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
        this.setState({date: date, dateModified: true});
      }
    } catch ({code, message}) {
      console.warn('Error in setting date: ', message);
    }
  };

  async _showTimePicker() {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open({is24Hour:false, hour: this.state.date.getHours(), minute: this.state.date.getMinutes()});
      if (action === TimePickerAndroid.timeSetAction) {
        var date = this.state.date
        date.setMinutes(minute)
        date.setHours(hour)
        this.setState({date : date, timeModified: true})
      }
    } catch ({code, message}) {
      console.warn(`Error in setting time: `, message);
    }
  };

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
            onPress={this._onJoin.bind(this)}>
            <Text style={styles.buttontext1}> Join </Text>
          </TouchableHighlight>}

          {!this.state.host && <TouchableHighlight
            style={styles.button1}
            onPress={this._onLeave.bind(this)}>
            <Text style={styles.buttontext1}> Leave </Text>
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

        <View style={styles.emptyview}><Text style={styles.title}>Date and Time:</Text></View>

        <View style={styles.datetime}>
          <TouchableHighlight
            onPress={this.state.host ? this._showDatePicker.bind(this) : this._doNothing.bind(this)}>
            <Text style={styles.text}>{this.state.date.toLocaleDateString()}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.state.host ? this._showTimePicker.bind(this) : this._doNothing.bind(this) }>
            <Text style={styles.text}>{this.state.date.toLocaleTimeString()}</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.emptyview}><Text style={styles.title}>Location:</Text></View>

        <TextInput
          style={styles.textinput}
          placeholder="Type event location"
          defaultValue={this.state.location}
          onChangeText={(text) => this.setState({location : text, locationModified: true})}
          underlineColorAndroid = 'transparent'
          editable={this.state.host}
        />

        <View style={styles.datetime}>
          <View style={styles.emptyview}><Text style={styles.title}>Type:</Text></View>
          <Picker
            style={styles.emptyview, {width: 350}}
            selectedValue = {this.state.type}
            onValueChange={(value) => this.setState({type : value})}
            enabled = {this.state.host}>
            {eventTypes.map((e) => (
              <Picker.Item
                key= 'key'
                value= {e}
                label= {e}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.emptyview}><Text style={styles.title1}>View Guest List:</Text></View>

        <TouchableHighlight
          style={styles.datetime}
          onPress={this._guest.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.guest}> Guests: {this.state.guests} </Text>
        </TouchableHighlight>

        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Vote allowed
          </Text>
          <Switch
            onValueChange={this._onSwitchVote.bind(this)}
            style={{marginTop: 5}}
            value={this.state.vote}
            disabled={!this.state.host}/>
        </View>

        <View style={styles.unlimited}>
          <Text style={styles.title}>
            Unlimited number of people
          </Text>
          <Switch
            onValueChange={this._onSwitchCap.bind(this)}
            style={{marginTop: 5}}
            value={this.state.unlimited}
            disabled={!this.state.host}/>
        </View>

        {!this.state.unlimited &&
          <View style={styles.datetime}>
            <View style={styles.emptyview}><Text style={styles.title}>Number of people: </Text></View>
            <Picker
              style={styles.emptyview, {width: 60}}
              selectedValue={this.state.limited}
              onValueChange={(value) => this.setState({limited : value})}
              enabled={this.state.host} >
              {this.state.numbers.map((n) => (
                <Picker.Item
                  key= 'key'
                  value= {n}
                  label= {n.toString()}
                />
              ))}
            </Picker>
          </View>
        }

        <View style={styles.emptyview}><Text style={styles.title1}>Comments:</Text></View>

        <View style={styles.container2}>
          <ListView
            dataSource={this.state.comments}
            renderRow={(rowData) => <Text style = {styles.text1}>{rowData}</Text>}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>

        <View style={styles.emptyview} />

        {this.state.host && <TouchableHighlight
          style={styles.button2}
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
    paddingTop: 60,
    paddingHorizontal: 5,
  },
  container2: {
    flex: 3,
    width: 400,
    backgroundColor: '#C5CAE9'
  },
  emptyview: {
    height: 40,
  },
  title: {
    fontSize: 20,
    paddingTop: 10,
    color:'#455A64'
  },
  title1: {
    fontSize: 20,
    color:'#455A64'
  },
  guest: {
    fontSize: 20,
    color: 'black'
  },
  textinput: {
    height: 30,
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
    flex:1,
    flexDirection:'row'
  },
  text: {
    color: 'grey',
    fontSize: 25,
    paddingHorizontal:10,
    paddingTop: 3
  },
  text1: {
    color: '#fffff0',
    fontSize: 30,
    fontWeight: '300',
    backgroundColor: 'transparent'
  },
  unlimited: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonlayout: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 110,
    backgroundColor: 'lightgray',
  },
  button1: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  button2: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
    marginHorizontal: 50,
  },
  buttontext: {
    fontSize: 20,
    fontWeight: '300',
    color: 'black',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingTop:5,
  },
  buttontext1: {
    fontSize: 15,
    fontWeight: '300',
    width:80,
    color: 'black',
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
  buttontext2: {
    fontSize: 15,
    fontWeight: '300',
    width:100,
    color: 'black',
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
});

AppRegistry.registerComponent('EvengPage', () => EvengPage);

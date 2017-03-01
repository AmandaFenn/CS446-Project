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

const eventTypes = ['Restaurants', 'Coffee', 'Bar', 'Movie', 'Sports', 'Casino', 'Others']

export default class EvengPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      description : '',
      location : '',
      type: 'Restaurants',
      date: new Date(),
      vote: true,
      unlimited: true,
      limited: 1,
      numberPickerVisible: false,
      guests: 0,
      eventRef : this.props.firebaseApp.database().ref('Events/'+ this.props.route.eventId),
      comments: this._createListdataSource(['User1: comment1','User2: comment2','User3: comment3']),
      descriptionModified: false,
      locationModified: false,
      dateModified: false,
      timeModified: false,
      host: true,
      numbers : Array.apply(null, {length: 1000}).map(Number.call, Number)
    }
    this._initData()
  }

  componentWillMount() {
    this._loadEventCallBack = this._loadEventCallBack.bind(this)
    this._loadEvent()
  }

  componentWillUnmount() {
    this.state.eventRef.off('value', this._loadEventCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _createListdataSource(array) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(array)
  }

  _loadEventCallBack(snapshot) {
    var parts = snapshot.child('Participants').numChildren()
    var numbers = Array.apply(null, {length: 1000}).map(Number.call, Number)
    for (i = 0; i < parts; i++) {
      numbers.shift()
    }
    this.setState({
      guests: parts,
      limited: parts,
      numbers: numbers
    });
    if(!snapshot.child('Participants/' + this.props.route.fbId + '/Host').val()) {
      this.setState({host: false})
    }
  }

  _loadEvent() {
    this.state.eventRef.on('value', this._loadEventCallBack, function(error) {
      console.error(error);
    });
  }

  _checkInfo() {
    var check = false
    var checkInfo = ''

    if (this.state.location == '') {
      check = true
      checkInfo += 'Please enter the event location!\n'
    }

    if (check) {
      alert(checkInfo)
    }
    return check
  }

  _initDataRead(snapshot) {
    var snapshotdata = snapshot.val()
    var date = new Date(snapshotdata.Date + ' ' + snapshotdata.Time)
    this.setState({
      description:snapshotdata.Description,
      location:snapshotdata.Location,
      date: date,

    })
  }

  _initData() {
    var eventRef = this.props.firebaseApp.database().ref('Events/'+ this.props.route.eventId)
    eventRef.once('value').then(this._initDataRead.bind(this))
  }

  _onSuggest() {
    this.props.navigator.push({
      title: 'Map',
      index: 6,
      fbId : this.props.route.fbId,
      eventId : this.props.route.eventId,
      guest: true
    });
  }

  _guest() {
    this.props.navigator.push({
      title : 'Guests',
      index : 4,
      fbId : this.props.route.fbId,
      eventId : this.props.route.eventId,
      guest: true,
      host: this.state.host
    });
  }

  _friend() {
    this.props.navigator.push({
      title : 'Friends',
      index : 4,
      fbId : this.props.route.fbId,
      eventId : this.props.route.eventId,
      guest: false,
      host: this.state.host
    });
  }

  _updateEvent() {
    var eventRef = this.props.firebaseApp.database().ref('Events/'+ this.props.route.eventId)
    var newData = {}
    if (this.state.descriptionModified) {
      newData['Description'] = this.state.description
    }
    if (this.state.dateModified) {
      newData['Date'] = this.state.date.toLocaleDateString()
    }
    if (this.state.timeModified) {
      newData['Time'] = this.state.date.toLocaleTimeString()
    }
    if (this.state.locationModified) {
      newData['Location'] = this.state.location
    }
    eventRef.update(newData)
  }

  _submit() {
    if ((
      this.state.descriptionModified ||
      this.state.dateModified ||
      this.state.timeModified ||
      this.state.locationModified) &&
      !this._checkInfo()) {
        this._updateEvent()
        this._onBack()
    }
  }

  _deleteEvent() {
    this.props.firebaseApp.database().ref('Events/'+ this.props.route.eventId).remove()
    this._onBack()
  }

  _onJoin() {
    var newPart = {}
    newPart[this.props.route.fbId] = {'Host': false, 'Name': this.props.route.name, 'Status':2}
    this.state.eventRef.child('Participants/').update(newPart)
  }

  _onLeave() {
    this.state.eventRef.child('Participants/' + this.props.route.fbId).remove()
  }
  
  onDateChange = (date) => {
    this.setState({date: date});
  };

  _onSwitchVote(value) {
    this.setState({vote: value})
  }

  _onSwitchCap(value) {
    this.setState({unlimited: value})
    if (value) {
      this.setState({numberPickerVisible: false})
    }
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


        <View style={styles.location} >
          <View style={styles.emptyview}><Text style={styles.title}>Location:</Text></View>
          <TouchableHighlight
            style={styles.button}
            onPress={this._onSuggest.bind(this)}>
            <Text style={styles.buttontext}> Sugeest Location</Text>
          </TouchableHighlight>
        </View>

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

        <View style={styles.location}>
          <View style={styles.emptyview}><Text style={styles.guest}>Guests: {this.state.guests}</Text></View>
          <TouchableHighlight
            style={styles.button1}
            onPress={this._guest.bind(this)}>
            <Text style={styles.buttontext1}> {this.state.host? 'Manage': 'View'} </Text>
          </TouchableHighlight>
          {this.state.host && 
          <TouchableHighlight
            style={styles.button1}
            onPress={this._friend.bind(this)}>
            <Text style={styles.buttontext1}> Invite </Text>
          </TouchableHighlight>}
        </View>

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

        <View style={styles.buttonlayout} elevation={3}>
          <TouchableHighlight
            style={styles.button2}
            onPress={this.state.host ? this._submit.bind(this) : this._onJoin.bind(this)}>
            <Text style={styles.buttontext2}> {this.state.host ? 'Save' : 'Join'} </Text>
            </TouchableHighlight>
          <TouchableHighlight
            style={styles.button2}
            onPress={this.state.host ? this._deleteEvent.bind(this) : this._onLeave.bind(this)}>
            <Text style={styles.buttontext2}> {this.state.host ? 'Delete' : 'Leave'} </Text>
          </TouchableHighlight>
        </View>
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
    paddingTop: 10,
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
    marginHorizontal: 25,
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
    width:100,
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

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
  ScrollView,
  ListView
} from 'react-native';

export default class EvengPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      description : '',
      location : '',
      date: new Date(),
      guests: 0,
      eventRef : this.props.firebaseApp.database().ref('Events/'+ this.props.route.eventId),
      comments: this._createListdataSource(['User1: comment1','User2: comment2','User3: comment3']),
      descriptionModified: false,
      locationModified: false,
      dateModified: false,
      timeModified: false,
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
    this.setState({
      guests: snapshot.child('Participants').numChildren()
    });
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

  _guest() {
    this.props.navigator.push({
      title : 'Guests',
      index : 4,
      fbId : this.props.route.fbId,
      eventId : this.props.route.eventId,
      guest: true
    });
  }

  _friend() {
    this.props.navigator.push({
      title : 'Friends',
      index : 4,
      fbId : this.props.route.fbId,
      eventId : this.props.route.eventId,
      guest: false
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
          style={styles.textinput1}
          placeholder="Type event description!"
          defaultValue={this.state.description}
          onChangeText={(text) => this.setState({description : text, descriptionModified:true})}
          multiline={true}
        />

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


        <View style={styles.location} >
          <View style={styles.emptyview}><Text style={styles.title}>Location:</Text></View>
          <TouchableHighlight
            style={styles.button}
            onPress={this._onBack.bind(this)}>
            <Text style={styles.buttontext}> Sugeest Location</Text>
          </TouchableHighlight>
        </View>

        <TextInput
          style={styles.textinput}
          placeholder="Type event location"
          defaultValue={this.state.location}
          onChangeText={(text) => this.setState({location : text, locationModified: true})}
          underlineColorAndroid = 'transparent'
        />

        <View style={styles.emptyview}><Text style={styles.title}>View Guest List:</Text></View>

        <View style={styles.location}>
          <View style={styles.emptyview}><Text style={styles.guest}>Guests: {this.state.guests}</Text></View>
          <TouchableHighlight
            style={styles.button1}
            onPress={this._guest.bind(this)}>
            <Text style={styles.buttontext1}> Manage </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button1}
            onPress={this._friend.bind(this)}>
            <Text style={styles.buttontext1}> Invite </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.emptyview}><Text style={styles.title}>Comments:</Text></View>

        <View style={styles.container2}>
          <ListView
            dataSource={this.state.comments}
            renderRow={(rowData) => <Text style = {styles.text1}>{rowData}</Text>}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>

        <View style={styles.emptyview} />

        <View style={styles.buttonlayout}>
          <TouchableHighlight
            style={styles.button2}
            onPress={this._submit.bind(this)}>
            <Text style={styles.buttontext2}> Save </Text>
            </TouchableHighlight>
          <TouchableHighlight
            style={styles.button2}
            onPress={this._deleteEvent.bind(this)}>
            <Text style={styles.buttontext2}> Delete </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    paddingTop: 80,
  },
  container2: {
    flex: 3,
    width: 400,
    backgroundColor: 'purple'
  },
  emptyview: {
    height: 40
  },
  title: {
    fontSize:30,
    color:'deepskyblue'
  },
  guest: {
    fontSize:30,
    color: 'black'
  },
  textinput: {
    height: 45,
    fontSize: 30,
    padding: 5
  },
  textinput1: {
    height: 150,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
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
  text1: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '600',
    backgroundColor: 'transparent'
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
    marginHorizontal: 100,
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
    fontWeight: '600',
    width:180,
    color: 'black',
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
  buttontext1: {
    fontSize: 20,
    fontWeight: '600',
    width:100,
    color: 'black',
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
  buttontext2: {
    fontSize: 20,
    fontWeight: '600',
    width:100,
    color: 'black',
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
});

AppRegistry.registerComponent('EvengPage', () => EvengPage);

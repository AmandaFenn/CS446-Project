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
  ScrollView,
  ListView
} from 'react-native';

import GuestList from '../iOSComps/GuestList';

export default class EvengPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name : 'EventPageTest',
      description : 'None',
      location : 'Waterloo',
      date: new Date(),
      datePickerVisible: false,
      guests: 0,
      eventRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId),
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
    var eventRef = this.props.firebaseApp.database().ref('Events/'+ this.props.eventId)
    eventRef.once('value').then(this._initDataRead.bind(this))
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
        guest: true
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
        guest: false
      }
    });
  }
  
  _updateEvent() {
    var eventRef = this.props.firebaseApp.database().ref('Events/'+ this.props.eventId)
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
    this.props.firebaseApp.database().ref('Events/'+ this.props.eventId).remove()
    this._onBack()
  }

  onDateChange = (date) => {
    this.setState({date: date});
  };

  _onDatePress() {
    this.setState({datePickerVisible: !this.state.datePickerVisible});
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
        />
        
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
        />
        
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

        <View style={styles.comments}>
          <ListView 
            dataSource={this.state.comments}
            renderRow={(rowData) => <Text style = {styles.commenttext}>{rowData}</Text>}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>
        
        <View style={styles.emptyview} />

        <View style={styles.buttonlayout}>
          <TouchableHighlight
            style={styles.button2}
            onPress={this._submit.bind(this)}>
            <Text style={styles.buttontext1}> Save </Text>
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
    paddingHorizontal: 5
  },
  emptyview: {
    height: 40,
  },
  title: {
    fontSize:30,
    color:'blue'
  },
  description: {
    height: 150,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    fontSize: 30,
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
    fontSize: 30,
    padding: 5
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
    fontWeight: '600',
    width:180,
    color: 'black',
    textAlign: 'center',
    paddingVertical:10,
    paddingHorizontal:5
  },
  button1: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
    marginHorizontal: 12
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
  textinput: {
    height: 45,
    fontSize: 30,
    paddingHorizontal: 5
  },
  comments: {
    width: 360,
    backgroundColor: 'purple'
  },
  commenttext: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '600',
    backgroundColor: 'transparent'
  },
  guest: {
    fontSize:30,
    color: 'black'
  },
  buttonlayout: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button2: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
    marginHorizontal: 40,
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
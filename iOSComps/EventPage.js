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

import GuestList from '../iOSComps/GuestList';
import SuggestMap from '../iOSComps/SuggestMap';

const eventTypes = ['Restaurants', 'Coffee', 'Bar', 'Movie', 'Sports', 'Casino', 'Others']

export default class EvengPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name : 'EventPageTest',
      description : 'None',
      location : 'Waterloo',
      type: 'Restaurants',
      date: new Date(),
      vote: true,
      unlimited: true,
      limited: 1,
      datePickerVisible: false,
      typePickerVisible: false,
      numberPickerVisible: false,
      guests: 0,
      eventRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId),
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
    if(!snapshot.child('Participants/' + this.props.fbId + '/Host').val()) {
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
    var eventRef = this.props.firebaseApp.database().ref('Events/'+ this.props.eventId)
    eventRef.once('value').then(this._initDataRead.bind(this))
  }
  
  _onSuggest() {
    this.props.navigator.push({
      component: SuggestMap,
      title: 'Map',
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

  _onJoin() {
    var newPart = {}
    newPart[this.props.fbId] = {'Host': false, 'Name': this.props.name, 'Status':2}
    this.state.eventRef.child('Participants/').update(newPart)
  }
  
  _onLeave() {
    this.state.eventRef.child('Participants/' + this.props.fbId).remove()
  }
  
  onDateChange = (date) => {
    this.setState({date: date});
  };

  _onDatePress() {
    this.setState({datePickerVisible: !this.state.datePickerVisible});
  }
  
  _onTypePress() {
    this.setState({typePickerVisible: !this.state.typePickerVisible});
  }
  
  _onNumberPress() {
    this.setState({numberPickerVisible: !this.state.numberPickerVisible});
  }
  
  _onSwitchVote(value) {
    this.setState({vote: value})
  }
  
  _onSwitchCap(value) {
    this.setState({unlimited: value})
    if (value) {
      this.setState({numberPickerVisible: false})
    }
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
        
        <View style={styles.location} >
          <View style={styles.emptyview}><Text style={styles.title}>Location:</Text></View>
          <TouchableHighlight
            style={styles.button}
            onPress={this._onSuggest.bind(this)}>
            <Text style={styles.buttontext}> Sugeest Location</Text>
          </TouchableHighlight>
        </View>
        
        <TextInput
          style={styles.typeandnumber}
          placeholder="Type event location"
          defaultValue={this.state.location}
          onChangeText={(text) => this.setState({location : text, locationModified: true})}
          editable={this.state.host}
        />
        
        <View style={styles.emptyview}><Text style={styles.title}>Type:</Text></View>
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
          {eventTypes.map((e) => (
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
            value={this.state.vote} 
            disabled={!this.state.host} />
        </View>
        
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
          onValueChange={(value) => this.setState({limited : value})}>
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

        <View style={styles.buttonlayout}>
          <TouchableHighlight
            style={styles.button2}
            onPress={this.state.host ? this._submit.bind(this) : this._onJoin.bind(this)}>
            <Text style={styles.buttontext1}> {this.state.host ? 'Save' : 'Join'} </Text>
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
    marginHorizontal: 12
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
    backgroundColor: 'lightgray',
    marginHorizontal: 40,
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
  unlimited: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
});

AppRegistry.registerComponent('EvengPage', () => EvengPage);
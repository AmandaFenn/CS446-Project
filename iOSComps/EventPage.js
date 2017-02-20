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

export default class EvengPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name : 'EventPageTest',
      description : 'None',
      location : 'Waterloo',
      date: new Date(),
      datePickerVisible: false,
      guests: 1,
      comments: this._createListdataSource(['test1','comment2','comment3']),
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _createListdataSource(array) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(array)
  }
  
  _checkInfo() {
    var check = false
    var checkInfo = ''
    if (this.state.name == '') {
      check = true
      checkInfo += 'Please enter the event name!\n'
    }

    if (this.state.location == '') {
      check = true
      checkInfo += 'Please enter the event location!\n'
    }

    if (check) {
      alert(checkInfo)
    }
    return check
  }

  _updateEvent() {
    var eventlistRef = this.props.firebaseApp.database().ref('Events/').push()
    eventlistRef.set({
      'Name': this.state.name,
      'Date': this.state.date.toLocaleDateString(),
      'Time': this.state.date.toLocaleTimeString(),
      'Location': this.state.location,
      'Description': this.state.description,
    })
    var addHost = {};
    var hostData = {
       'Name': this.props.name,
       'Host': true,
       'Status': 0
    }
    var newPostKey = eventlistRef.key
    addHost['/Events/' + newPostKey + '/Participants/' + this.props.fbId] = hostData;
    this.props.firebaseApp.database().ref().update(addHost)
  }

  _submit() {
    if (!this._checkInfo()) {
      this._updateEvent()
    }
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
        <TextInput
          style={styles.textinput1}
          placeholder="Type event description!"
          defaultValue={this.state.description}
          onChangeText={(text) => this.setState({description : text})}
          multiline={true}
        />
        <View style={styles.emptyview} />
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
        
        <View style={styles.emptyview} />
        
        <View style={styles.location} >
          <View style={styles.textinputview1}>
            <TextInput
              style={styles.textinput}
              placeholder="Type event location"
              defaultValue={this.state.location}
              onChangeText={(text) => this.setState({location : text})}
            />
          </View>
          <TouchableHighlight
            style={styles.button}
            onPress={this._onBack.bind(this)}>
            <Text style={styles.buttontext}> Sugeest</Text>
          </TouchableHighlight>
        </View>
        
        <View style={styles.emptyview} />
        
        <View style={styles.location}>
          <Text>Guests: {this.state.guests}</Text>
          <TouchableHighlight
            style={styles.button}
            onPress={this._onBack.bind(this)}>
            <Text style={styles.buttontext}> Manage </Text>
          </TouchableHighlight>
        </View>
        
        <View style={styles.emptyview} />
        
        <Text>Comments</Text>
        <View style={styles.container2}>
          <ListView 
            dataSource={this.state.comments}
            renderRow={(rowData) => <Text style = {styles.text1}>{rowData}</Text>}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>
        
        <View style={styles.emptyview} />
        <TouchableHighlight
          style={styles.button}
          onPress={this._onBack.bind(this)}>
          <Text style={styles.buttontext}> Save </Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    paddingTop: 40
  },
  container2: {
    flex: 3,
    width: 360,
    backgroundColor: 'purple'
  },
  emptyview: {
    height: 40
  },
  textinputview: {
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
  },
  textinputview1: {
    borderColor: 'grey',
    borderWidth: 0.5,
    backgroundColor: 'white',
    flex:2,
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
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    width: 100,
    backgroundColor: '#008080',    
    flex:3
  },
  buttontext: {
    fontSize: 30,
    fontWeight: '600',
    color: '#fffff0',
    textAlign: 'center',
    paddingVertical:10
  },
  text1: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '600',
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('EvengPage', () => EvengPage);
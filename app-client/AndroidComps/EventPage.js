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
  ListView,
  Modal
} from 'react-native';
import SharedEventPage from '../sharedComps/EventPage';
import GeoLocation from './GeoLocation'
import Constants from '../utils/Constants'

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
        GeoCoordinate: this.state.GeoCoordinate
      }
    });
  }

  _onVote() {
    this.props.navigator.push({
      title: 'Votes',
      index: 7,
      passProps: {
        fbId : this.props.fbId,
        host: this.state.host,
        eventId : this.props.eventId,
        guestVote: this.state.guestVote
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
        host: this.state.host,
        name: this.state.name,
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
        host: this.state.host,
        name: this.state.name,
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

  _renderComments(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.comment}>
        <View style = {styles.comment_user}>
          <Image source = {{uri: this.state.commenters[rowData.id] ? this.state.commenters[rowData.id].pic : Constants.fbIcon}} style = {styles.comment_user_pic}/>
          <View style = {styles.comment_user_name}>
            <Text>{this.state.commenters[rowData.id] ? this.state.commenters[rowData.id].name : ''}</Text>
          </View>
        </View>
        <View style = {styles.comment_text}>
          <Text> {rowData.comment} </Text>
        </View>
      </View>
    )
  }

  _renderSeparator(sectionID , rowID , adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
        height: adjacentRowHighlighted ? 4 : 1,
        backgroundColor: adjacentRowHighlighted ? '#3F51B5' : '#C5CAE9',
      }}
      />
    );
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
        <Image
          source={this.state.avatarSource}
          style = {{width:400, height:100}}
          resizeMode={Image.resizeMode.stretch}/>

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
          {(this.state.status == -1 || this.state.status == 1) && <TouchableHighlight
            style={styles.button1}
            onPress={this._onJoin.bind(this)}>
            <Text style={styles.buttontext1}> {this.state.status > 0 ? 'Accept' : 'Join'} </Text>
          </TouchableHighlight>}

          {!this.state.host && this.state.status >= 0 && <TouchableHighlight
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

          {this.state.status >= 0 && this.state.status < 2 && <TouchableHighlight
            style={styles.button1}
            onPress={this._onSuggest.bind(this)}>
            <Text style={styles.buttontext1}> Suggest </Text>
          </TouchableHighlight>}

          {this.state.status == 0 && <TouchableHighlight
            style={styles.button1}
            onPress={this._onVote.bind(this)}>
            <Text style={styles.buttontext1}> Vote </Text>
          </TouchableHighlight>}

          {this.state.host && <TouchableHighlight
            style={styles.button1}
            onPress={this._deleteEvent.bind(this)}
            underlayColor = 'lightgray'>
            <Text style={styles.buttontext2}> Delete </Text>
          </TouchableHighlight>}
        </View>
        <View style={styles.emptyview}><Text style={styles.title1}>Type: {this.state.private ? 'Private' : 'Public'}</Text></View>
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
          <View style={styles.emptyview}><Text style={styles.title}>Category:</Text></View>
          <Picker
            style={styles.emptyview, {width: 350}}
            selectedValue = {this.state.type}
            onValueChange={(value) => this.setState({type : value})}
            enabled = {this.state.host}>
            {Constants.eventTypes.map((e) => (
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
            value={this.state.guestVote}
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
              onValueChange={(value) => this.setState({limited:value, capModified:true})}
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

        {this.state.status == 0 && <TextInput
          style={styles.textinput}
          placeholder="Comment"
          defaultValue={this.state.tmpComment}
          onChangeText={(text) => this.setState({tmpComment : text})}
          underlineColorAndroid = 'transparent'
        />}

        {this.state.status == 0 && <TouchableHighlight
          style={styles.button2}
          onPress={this._comment.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.buttontext2}> Comment </Text>
        </TouchableHighlight>}

        <View style={styles.container2}>
          <ListView
            dataSource={this.state.comments}
            renderRow={this._renderComments.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            renderSeparator={this._renderSeparator}/>
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
  comment: {
    flexDirection: 'row',
    width: 400,
    height: 60
  },
  comment_user: {
    flex: 1,
    flexDirection: 'column',
    height: 60
  },
  comment_user_pic: {
    flex: 2,
    width: 40,
    height: 40
  },
  comment_user_name: {
    flex: 1
  },
  comment_text: {
    flex: 9
  }

});

AppRegistry.registerComponent('EvengPage', () => EvengPage);

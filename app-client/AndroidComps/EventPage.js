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
import {renderSeparator} from '../utils/HelpFuncs';
import Constants from '../utils/Constants'

export default class EventPage extends SharedEventPage {
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
        GeoCoordinate: this.state.GeoCoordinate,
        type: this.state.type
      }
    });
  }

  _onVote() {
    this.props.navigator.push({
      title: 'Pollings',
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

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Modal
          transparent={true}
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

        <View style = {{height:5}}/>

        <View style={styles.buttons}>
          {(this.state.status == -1 || this.state.status == 1) && <View style = {styles.buttoncontainer}>
            <TouchableHighlight
              style={styles.button1}
              onPress={this._onJoin.bind(this)}
              underlayColor = 'lightgray'>
              <View>
                <Image source = {this.state.status > 0 ? require('../img/accept.png') : require('../img/add.png')} style = {styles.icon}/>
                <Text style={styles.buttontext}> {this.state.status > 0 ? 'Accept' : 'Join'} </Text>
              </View>
            </TouchableHighlight>
          </View>}

          {!this.state.host && this.state.status >= 0 && <View style = {styles.buttoncontainer}>
            <TouchableHighlight
            style={styles.button1}
            onPress={this._onLeave.bind(this)}
            underlayColor = 'lightgray'>
              <View>
                <Image source = {require('../img/leave.png')} style = {styles.icon}/>
                <Text style={styles.buttontext}> Leave </Text>
              </View>
            </TouchableHighlight>
          </View>}

          {this.state.host && <View style = {styles.buttoncontainer}>
            <TouchableHighlight
              style={styles.button1}
              onPress={this._friend.bind(this)}
              underlayColor = 'lightgray'>
              <View>
                <Image source = {require('../img/invite.png')} style = {styles.icon}/>
                <Text style={styles.buttontext}> Invite </Text>
              </View>
            </TouchableHighlight>
          </View>}

          {this.state.status >= 0 && this.state.status < 2 && <View style = {styles.buttoncontainer}>
            <TouchableHighlight
              style={styles.button1}
              onPress={this._onSuggest.bind(this)}
              underlayColor = 'lightgray'>
              <View>
                <Image source = {require('../img/suggest.png')} style = {styles.icon}/>
                <Text style={styles.buttontext}> Suggest </Text>
              </View>
            </TouchableHighlight>
          </View>}

          {this.state.status == 0 && <View style = {styles.buttoncontainer}>
            <TouchableHighlight
              style={styles.button1}
              onPress={this._onVote.bind(this)}
              underlayColor = 'lightgray'>
              <View>
               <Image source = {require('../img/vote.png')} style = {styles.icon}/>
               <Text style={styles.buttontext}> Vote </Text>
             </View>
            </TouchableHighlight>
          </View>}

          {this.state.host && <View style = {styles.buttoncontainer}>
            <TouchableHighlight
              style={styles.button1}
              onPress={this._deleteEvent.bind(this)}
              underlayColor = 'lightgray'>
              <View>
                <Image source = {require('../img/delete.png')} style = {styles.icon}/>
                <Text style={styles.buttontext}> Delete </Text>
              </View>
            </TouchableHighlight>
          </View>}
        </View>
        <View style={styles.emptyview}><Text style={styles.title}>Type: {this.state.private ? 'Private' : 'Public'}</Text></View>
        <View style={styles.emptyview}><Text style={styles.title}>Date and Time:</Text></View>

        <View style={styles.datetimecontainer}>
          <TouchableHighlight
            style={styles.datetime}
            onPress={this.state.host ? this._showDatePicker.bind(this) : this._doNothing.bind(this)}
            underlayColor = 'lightgray'>
            <Text style={styles.text}>{this.state.date.toLocaleDateString()}</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.datetime}
            onPress={this.state.host ? this._showTimePicker.bind(this) : this._doNothing.bind(this) }
            underlayColor = 'lightgray'>
            <Text style={styles.text}>{this.state.date.toLocaleTimeString()}</Text>
          </TouchableHighlight>
        </View>

        <View style = {{height:5}}/>

        <View style = {styles.location}>
          <View style={{flex: 3}}><Text style={styles.title}>Location:</Text></View>
          <View style={{flex: 10}}>
            <TextInput
              style={styles.locationtextinput}
              placeholder="Type event location"
              defaultValue={this.state.location}
              onChangeText={(text) => this.setState({location : text, locationModified: true})}
              underlineColorAndroid = 'transparent'
              editable={this.state.host}
            />
          </View>
        </View>

        <View style = {{height:5}}/>

        <View style = {styles.location}>
          <View style={{flex: 3}}><Text style={styles.title}>Category:</Text></View>
          <View style={[{flex: 10, justifyContent: 'center'},styles.type]}>
            <Picker
              selectedValue = {this.state.type}
              onValueChange={this._onTypeChange.bind(this)}
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
        </View>

        <View style = {{height:5}}/>

        <TouchableHighlight
          style={styles.number}
          onPress={this._guest.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.guest}> Guests: {this.state.guests} </Text>
        </TouchableHighlight>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Allow guests to create votes</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchVote.bind(this)}
              value={this.state.guestVote}
              disabled={!this.state.host}/>
          </View>
        </View>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Unlimited number of people</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchCap.bind(this)}
              value={this.state.unlimited}
              disabled={!this.state.host}/>
          </View>
        </View>

        <View style = {{height:5}}/>

        {!this.state.unlimited &&
          <View style = {styles.location}>
            <View style={{flex: 3}}><Text style={styles.title}>Number of people:</Text></View>
            <View style={[{flex: 4, justifyContent: 'center'},styles.type]}>
              <Picker
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
          </View>
        }

        <View style = {{height:5}}/>

        {this.state.status == 0 && <View style = {styles.location}>
          <View style = {{flex: 3}}>
            <TextInput
              style={styles.commenttextinput}
              placeholder="Comment"
              defaultValue={this.state.tmpComment}
              onChangeText={(text) => this.setState({tmpComment : text})}
              underlineColorAndroid = 'transparent'
            />
          </View>
            <View style = {{flex: 1}}>
            <TouchableHighlight
              style={{height:40, justifyContent:'center'}}
              onPress={this._comment.bind(this)}
              underlayColor = 'lightgray'>
              <Text style={styles.commentbuttontext}> Comment </Text>
            </TouchableHighlight>
            </View>
        </View>}

        <View style = {{height:5}}/>

        <View style={styles.comments}>
          <ListView
            dataSource={this.state.comments}
            renderRow={this._renderComments.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false}
            renderSeparator={renderSeparator}/>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'ghostwhite',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 60
  },
  emptyview: {
    width: 400,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyview1: {
    width: 400
  },
  title: {
    fontSize: 20,
    color:'rgba(5, 123, 253, 1.0)',
  },
  commentbuttontext: {
    fontSize: 20,
    color:'red',
  },
  description: {
    height: 120,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    fontSize: 25,
    padding: 5,
    width: 400
  },
  datetimecontainer: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40
  },
  datetime: {
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    alignItems: 'center',
    width: 200,
    height: 40
  },
  text: {
    color: 'grey',
    fontSize: 25,
    padding: 3
  },
  buttons: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80
  },
  buttoncontainer: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  button: {
    width: 65,
    height: 85
  },
  icon: {
    width: 65,
    height: 65
  },
  buttontext: {
    fontSize: 15,
    fontWeight: '300',
    textAlign: 'center',
    width: 65,
    height: 20
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
    width: 400,
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white'
  },
  commenttextinput: {
    flex: 1,
    fontSize: 30,
    fontWeight: '300',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
  },
  comments: {
    width: 400,
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
    fontSize:30,
    fontWeight: '300',
  },
  buttonlayout: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
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

AppRegistry.registerComponent('EventPage', () => EventPage);

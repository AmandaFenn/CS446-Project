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
  ListView,
  Modal
} from 'react-native';
import SharedEventPage from '../sharedComps/EventPage';
import GuestList from '../iOSComps/GuestList';
import SuggestMap from '../iOSComps/SuggestMap';
import VotePage from '../iOSComps/VotePage';
import GeoLocation from './GeoLocation'
import {renderSeparator} from '../utils/HelpFuncs';
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
        GeoCoordinate: this.state.GeoCoordinate,
        type: this.state.type
      }
    });
  }

  _onVote() {
    this.props.navigator.push({
      component: VotePage,
      title: 'Votes',
      passProps: {
        firebaseApp : this.props.firebaseApp,
        title: 'Pollings',
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
        host: this.state.host,
        name: this.state.name,
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
        host: this.state.host,
        name: this.state.name,
      }
    });
  }

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
              style={styles.button}
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
              style={styles.button}
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
              style={styles.button}
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
              style={styles.button}
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
              style={styles.button}
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
              style={styles.button}
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

        <View style = {styles.emptyview1}>
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
            onDateChange={this._onDateChange.bind(this)}
          />}
        </View>

        <View style = {{height:5}}/>

        <View style = {styles.location}>
          <View style={{flex: 3}}><Text style={styles.title}>Location:</Text></View>
          <View style={{flex: 8}}>
            <TextInput
              style={styles.locationtextinput}
              placeholder="Type event location"
              defaultValue={this.state.location}
              onChangeText={(text) => this.setState({location : text, locationModified: true})}
              editable={this.state.host} />
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

        {this.state.typePickerVisible && this.state.host && <View style = {styles.emptyview1}>
          <PickerIOS
            selectedValue = {this.state.type}
            onValueChange={this._onTypeChange.bind(this)}>
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

        <TouchableHighlight
          style={styles.number}
          onPress={this._guest.bind(this)}
          underlayColor = 'lightgray'>
          <Text style={styles.guest}> Guests: {this.state.guests} </Text>
        </TouchableHighlight>

        <View style = {{height:5}}/>

        <View style={styles.location}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>Allow guests to create votes</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              onValueChange={this._onSwitchVote.bind(this)}
              value={this.state.guestVote}
              disabled={!this.state.host} />
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
              value={this.state.unlimited}
              disabled={!this.state.host} />
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
            onValueChange={(value) => this.setState({limited: value, capModified:true})}>
            {this.state.numbers.map((n) => (
              <PickerIOS.Item
                key= 'key'
                value= {n}
                label= {n.toString()}
              />
            ))}
          </PickerIOS>
        </View>}

        <View style = {{height:5}}/>

        {this.state.status == 0 && <View style = {styles.location}>
          <View style = {{flex: 5}}>
            <TextInput
              style={styles.commenttextinput}
              placeholder="Comment"
              defaultValue={this.state.tmpComment}
              onChangeText={(text) => this.setState({tmpComment : text})}
              underlineColorAndroid = 'transparent' />
          </View>
          <View style = {{flex: 2}}>
            <TouchableHighlight
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
            renderSeparator={renderSeparator} />
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
    padding: 5
  },
  datetime: {
    borderColor: 'grey',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
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
    width: 360,
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

import React, { Component, } from 'react'
import {
  AppRegistry,
} from 'react-native';
import {createListdataSource, sendNotification} from '../utils/HelpFuncs';
import Constants from '../utils/Constants'

export default class EventPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name : '',
      description : '',
      location : '',
      private: false,
      type: 'Eatings',
      date: new Date(),
      guestVote: true,
      unlimited: true,
      limited: -1,
      datePickerVisible: false,
      typePickerVisible: false,
      numberPickerVisible: false,
      guests: 0,
      eventRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId),
      comments: createListdataSource(['User1: comment1','User2: comment2','User3: comment3']),
      descriptionModified: false,
      locationModified: false,
      dateModified: false,
      timeModified: false,
      voteModified: false,
      capModified: false,
      host: true,
      member: true,
      status: 0,
      hostId: '',
      numbers : Array.apply(null, {length: 1000}).map(Number.call, Number),
      navUpdated: false,
      modalVisible: false,
      GeoCoordinate: {
        latitude: 43.464258,
        longitude: -80.520410,
      },
    }
    this._initData()
  }

  componentWillMount() {
    this._updateNav(this.state.host)
    this._loadEventCallBack = this._loadEventCallBack.bind(this)
    this._loadEvent()
  }

  componentWillUnmount() {
    this.state.eventRef.off('value', this._loadEventCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _updateNav(host) {
  }

  _loadEventCallBack(snapshot) {
    var parts = snapshot.child('Participants').numChildren()

    var numbers = Array.apply(null, {length: 1000}).map(Number.call, Number)
    for (i = 0; i < parts; i++) {
      numbers.shift()
    }

    var part = snapshot.child('Participants/' + this.props.fbId).val()
    var status = snapshot.child('Participants/' + this.props.fbId + '/Status').val()
    var GeoCoordinate = snapshot.child('Participants/' + this.props.fbId + '/Location').val()
    var guestVote = snapshot.child('GuestCanCreateVotes').val()

    this.setState({
      guests: parts,
      numbers: numbers,
      status: status!=null ? status : -1,
      GeoCoordinate: GeoCoordinate ? GeoCoordinate : this.state.GeoCoordinate,
      guestVote: guestVote != undefined ? guestVote : true,
    });

    if (!this.state.host) {
      this._readCap(snapshot)
      this._member(snapshot)
    }

    if(!snapshot.child('Participants/' + this.props.fbId + '/Host').val()) {
      this.setState({host: false})
      if (!this.state.navUpdated) {
        this._updateNav(false)
        this.setState({navUpdated: true})
      }
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

  _readCap(snapshot) {
    var cap = snapshot != undefined ? snapshot.child('Cap').val() : -1
    if (cap > 0) {
      this.setState({
        unlimited: false,
        limited: cap
      })
    } else {
      this.setState({
        unlimited: true,
        limited: this.state.guests
      })
    }
  }

  _member(snapshot) {
    var parts = snapshot.child('Participants').val()
    this.setState({
      member: parts[this.props.fbId] ? true : false
    })
  }

  _initDataRead(snapshot) {
    this._readCap(snapshot)
    this._member(snapshot)
    var snapshotdata = snapshot.val()
    var date = new Date(snapshotdata.Date + ' ' + snapshotdata.Time)
    var status = snapshot.child('Participants/' + this.props.fbId + '/Status').val()
    var GeoCoordinate = snapshot.child('Participants' + this.props.fbId + '/Location').val()

    this.setState({
      name: snapshotdata.Name,
      hostId: snapshotdata.HostID,
      private: snapshotdata.Private,
      description: snapshotdata.Description,
      location: snapshotdata.Location,
      date: date,
      status: status!=null ? status : -1,
      guestVote: snapshotdata.GuestCanCreateVotes,
      GeoCoordinate: GeoCoordinate ? GeoCoordinate : this.state.GeoCoordinate
    })
  }

  _initData() {
    var eventRef = this.props.firebaseApp.database().ref('Events/'+ this.props.eventId)
    eventRef.once('value').then(this._initDataRead.bind(this))
  }

  _onSuggest() {
  }

  _onVote() {
  }

  _guest() {
  }

  _friend() {
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
    if (this.state.voteModified) {
      newData['GuestCanCreateVotes'] = this.state.guestVote
    }
    if (this.state.capModified) {
      newData['Cap'] = this.state.limited
    }
    eventRef.update(newData)
  }

  _submit() {
    if ((
      this.state.descriptionModified ||
      this.state.dateModified ||
      this.state.timeModified ||
      this.state.locationModified ||
      this.state.voteModified ||
      this.state.capModified) &&
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
    if (this.state.unlimited || this.state.guests < this.state.limited) {
      this._onGeoMap()
    } else {
      alert('This event is full!')
    }
  }

  _onLeave() {
    this.state.eventRef.child('Participants/' + this.props.fbId).remove()
    sendNotification(this.props.firebaseApp.database().ref('Notifications/'+ this.state.hostId),
                      this.props.eventId,
                      this.props.name + Constants.messages[2] + this.state.name)
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
    this.setState({
      guestVote: value,
      voteModified: !this.state.voteModified
    })
  }

  _onSwitchCap(value) {
    this.setState({
      unlimited: value,
      capModified: !this.state.capModified
    })
    if (value) {
      this.setState({numberPickerVisible: false})
    }
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _onGeoMap() {
    this._setModalVisible(true)
  }

  _updateGeoCoordinate(newGeoCoordinate) {
    var newPart = {}
    var m = this.state.status > 0 ? 1 : 0
    if (this.state.status > 0) {
      newPart['Status'] = 0
      newPart['Location'] = newGeoCoordinate
      this.state.eventRef.child('Participants/' + this.props.fbId).update(newPart)
    } else {
      newPart[this.props.fbId] = {'Host': false, 'Name': this.props.name, 'Status':2, 'Location': newGeoCoordinate}
      this.state.eventRef.child('Participants/').update(newPart)
    }
    sendNotification(this.props.firebaseApp.database().ref('Notifications/'+ this.state.hostId),
                      this.props.eventId,
                      this.props.name + Constants.messages[m] + this.state.name)
    this.setState({
      GeoCoordinate: newGeoCoordinate
    })
    this._setModalVisible(false)
  }
}

AppRegistry.registerComponent('EventPage', () => EvengPage);

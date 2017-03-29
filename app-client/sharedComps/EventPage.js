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
      avatarSource : null,
      location : '',
      private: false,
      type: Constants.eventTypes[0],
      date: new Date(),
      guestVote: true,
      unlimited: true,
      limited: -1,
      datePickerVisible: false,
      typePickerVisible: false,
      numberPickerVisible: false,
      guests: 0,
      eventRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId),
      commenters: {},
      comments: createListdataSource([]),
      tmpComment: '',
      descriptionModified: false,
      locationModified: false,
      dateModified: false,
      timeModified: false,
      typeModified: false,
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
    this._loadUserInfo()
    //this._loadEventCallBack = this._loadEventCallBack.bind(this)
    //this._loadEvent()
  }

  componentDidMount() {
    this._getCurrentLocation()
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

    var comments = []

    snapshot.child('Comments').forEach(
      function(data) {
        var tmp = {}
        var id = data.val().id
        tmp['id'] = id
        tmp['comment'] = data.val().comment
        comments.push(tmp)
      }
    )

    comments.reverse()

    this.setState({
      guests: parts,
      numbers: numbers,
      status: status!=null ? status : -1,
      GeoCoordinate: GeoCoordinate ? GeoCoordinate : this.state.GeoCoordinate,
      guestVote: guestVote != undefined ? guestVote : true,
      comments: createListdataSource(comments),
    });

    if (!this.state.host) {
      this._readDescription(snapshot)
      this._readDate(snapshot)
      this._readLocation(snapshot)
      this._readGuestVote(snapshot)
      this._readType(snapshot)
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

  _userInfoCallBack(snapshot) {
    var commenters = {}
    snapshot.forEach(
      function(data) {
        var id = data.val().id
        commenters[data.key] = data.val()
      }
    )

    this.setState({
      commenters: commenters
    })

    // Load event info and add listener to events
    this._loadEventCallBack = this._loadEventCallBack.bind(this)
    this._loadEvent()
  }

  _loadUserInfo() {
    var userInfoListRef = this.props.firebaseApp.database().ref('Users')
    var userInfoCallBack = this._userInfoCallBack.bind(this)
    userInfoListRef.once('value').then(userInfoCallBack)
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

  _readDescription(snapshot) {
    var description = snapshot.child('Description').val()
    this.setState({
      description: description
    })
  }

  _readDate(snapshot) {
    var snapshotdata = snapshot.val()
    var date = new Date(snapshotdata.Date + ' ' + snapshotdata.Time)
    this.setState({
      date: date,
    })
  }

  _readLocation(snapshot) {
    var location = snapshot.child('Location').val()
    this.setState({
      location: location
    })
  }

  _readGuestVote(snapshot) {
    var guestVote = snapshot.child('GuestCanCreateVotes').val()
    this.setState({
      guestVote: guestVote
    })
  }

  _readType(snapshot) {
    var type = snapshot.child('Type').val()
    this.setState({
      type: type
    })
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
        limited: snapshot.child('Participants').numChildren()
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
    this._readDescription(snapshot)
    this._readDate(snapshot)
    this._readLocation(snapshot)
    this._readGuestVote(snapshot)
    this._readType(snapshot)
    this._readCap(snapshot)
    this._member(snapshot)
    var snapshotdata = snapshot.val()
    var status = snapshot.child('Participants/' + this.props.fbId + '/Status').val()
    var GeoCoordinate = snapshot.child('Participants' + this.props.fbId + '/Location').val()

    this.setState({
      name: snapshotdata.Name,
      hostId: snapshotdata.HostID,
      private: snapshotdata.Private,
      status: status!=null ? status : -1,
      GeoCoordinate: GeoCoordinate ? GeoCoordinate : this.state.GeoCoordinate,
    })
  }

  _initData() {
    var avatarRef = this.props.firebaseApp.storage().ref('Avatars/'+ this.props.eventId)
    avatarRef.getDownloadURL().then(this._loadAvatar.bind(this)).catch(
      function(error) {
        console.log('error', error)
      }
    )
    this.state.eventRef.once('value').then(this._initDataRead.bind(this))
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
    if (this.state.typeModified) {
      newData['Type'] = this.state.type
    }
    if (this.state.voteModified) {
      newData['GuestCanCreateVotes'] = this.state.guestVote
    }
    if (this.state.capModified) {
      newData['Cap'] = this.state.unlimited ? -1 : this.state.limited
    }
    eventRef.update(newData)
  }

  _submit() {
    if ((
      this.state.descriptionModified ||
      this.state.dateModified ||
      this.state.timeModified ||
      this.state.locationModified ||
      this.state.typeModified ||
      this.state.voteModified ||
      this.state.capModified) &&
      !this._checkInfo()) {
        this._updateEvent()
        this._onBack()
    }
  }

  _deleteEvent() {
    this.props.firebaseApp.database().ref('Events/'+ this.props.eventId).remove()
    this.props.firebaseApp.storage().ref('Avatars/' + this.props.eventId).delete().catch(function(error) {})
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

  _onDateChange(date) {
    this.setState({
      date: date,
      dateModified: true
    });
  };

  _onDatePress() {
    this.setState({datePickerVisible: !this.state.datePickerVisible});
  }

  _onTypeChange(value) {
    this.setState({
      type: value,
      typeModified: true
    })
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

  _getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      this._getCurrentLocationCallBack.bind(this),
      (error) => {console.log(error)},
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 5000}
    );
  }

  _getCurrentLocationCallBack(position) {
    this.setState({
      GeoCoordinate: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
    })
  }

  _loadAvatar(url) {
    //console.log('avatar', url)
    if (url) {
      this.setState({
        avatarSource: {uri: url}
      })
    }
  }

  _comment() {
    var commentRef = this.state.eventRef.child('Comments').push()
    commentRef.set({
      id: this.props.fbId,
      comment: this.state.tmpComment,
    })
    this.setState({tmpComment: ''})
  }

}

AppRegistry.registerComponent('EventPage', () => EvengPage);

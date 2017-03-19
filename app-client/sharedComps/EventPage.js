import React, { Component, } from 'react'
import {
  AppRegistry,
} from 'react-native';
import {createListdataSource} from '../utils/HelpFuncs';

const eventTypes = ['Restaurants', 'Coffee', 'Bar', 'Movie', 'Sports', 'Casino', 'Others']

export default class EventPage extends Component {
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
      host: true,
      numbers : Array.apply(null, {length: 1000}).map(Number.call, Number),
      navUpdated: false,
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
    this.props.navigator.replace({
      component: EventPage,
      title: this.props.title,
      rightButtonTitle: host ? 'Done' : '',
      onRightButtonPress: host ? this._submit.bind(this) : null,
      passProps: {
        firebaseApp : this.props.firebaseApp,
        name : this.props.name,
        title: this.props.title,
        fbId : this.props.fbId,
        eventId : this.props.eventId
      }
    });
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
}

AppRegistry.registerComponent('EventPage', () => EvengPage);

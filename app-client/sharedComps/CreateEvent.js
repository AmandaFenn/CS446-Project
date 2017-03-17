import React, { Component, } from 'react'
import {
  AppRegistry,
} from 'react-native';

export default class CreateEvent extends Component {
  constructor(props) {
    super(props)
    var date = new Date()
    date.setSeconds(0)
    this.state = {
      name : '',
      description : '',
      location : '',
      date: date,
      vote: true,
      type: 'Restaurants',
      unlimited: true,
      limited: 1,
      datePickerVisible: false,
      typePickerVisible: false,
      numberPickerVisible: false,
    }
  }

  componentWillMount() {
    this._updateNav()
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _updateNav() {
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

  _createEvent() {
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
      this._createEvent()
      this._onBack()
    }
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

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);

import React, { Component, } from 'react'
import {
  AppRegistry,
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import uploadImage from '../utils/ImageLoad'
import Constants from '../utils/Constants'

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
      guestVote: true,
      type: 'Eatings',
      unlimited: true,
      limited: 1,
      private: false,
      datePickerVisible: false,
      typePickerVisible: false,
      numberPickerVisible: false,
      modalVisible: false,
      GeoCoordinate: {
        latitude: 43.464258,
        longitude: -80.520410,
      },
      avatarSource : null,
      avatarURI : ''
    }
  }

  componentWillMount() {
    this._updateNav()
  }

  componentDidMount() {
    this._getCurrentLocation()
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
      'Type': this.state.type,
      'Private': this.state.private,
      'Cap': this.state.unlimited ? -1 : this.state.limited,
      'GuestCanCreateVotes': this.state.guestVote,
      'HostName' : this.props.name,
      'HostID' : this.props.fbId
    })
    var addHost = {};
    var hostData = {
       'Name': this.props.name,
       'Host': true,
       'Status': 0,
       'Location': this.state.GeoCoordinate,
    }
    var newPostKey = eventlistRef.key
    addHost['Events/' + newPostKey + '/Participants/' + this.props.fbId] = hostData;
    this.props.firebaseApp.database().ref().update(addHost)

    // Image
    if (this.state.avatarURI != '') {
      uploadImage(newPostKey, this.state.avatarURI)
    }
    //var storageRef = this.props.firebaseApp.storage().ref();
    //var file = new File()
    //storageRef.child('Avatars').put(file).then(function(snapshot) {
    //});

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

  _onSwitchPrivate(value) {
    this.setState({private: value})
  }

  _onSwitchVote(value) {
    this.setState({guestVote: value})
  }

  _onSwitchCap(value) {
    this.setState({unlimited: value})
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

  _onImage() {
    ImagePicker.showImagePicker(Constants.ImagePickerOptions, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        this.setState({
          avatarSource: null,
          avatarURI: ''
        })
        //console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        this.setState({
          avatarSource: source,
          avatarURI: response.uri
        });
      }
    });
  }
}

AppRegistry.registerComponent('CreateEvent', () => CreateEvent);

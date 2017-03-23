import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import {createListdataSource} from '../utils/HelpFuncs';

export default class GuestList extends Component {
  constructor(props){
    super(props)
    this.state = {
      guestsDataSource: createListdataSource([]),
      partsRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId + '/Participants'),
      capRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId + '/Cap'),
      unlimited: true,
      limited: -1,
      guests: [],
      guestIds : [],
      guestNum: 1
    }
    if (!this.props.guest) {
      this._loadfbInfo(-1, this.props.fbId)
    }
  }

  componentWillMount() {
    if (this.props.guest) {
      this._loadGuestsCallBack = this._loadGuestsCallBack.bind(this)
      this._loadGuests()
    } else {
      this._loadCapCallBack = this._loadCapCallBack.bind(this)
      this._loadCap()
      this._loadGuestNumCallBack = this._loadGuestNumCallBack.bind(this)
      this._loadGuestNum()
    }
  }

  componentWillUnmount() {
    if (this.props.guest) {
      this.state.partsRef.off('value', this._loadGuestsCallBack);
    } else {
      this.state.capRef.off('value', this._loadCapCallBack);
      this.state.partsRef.off('value', this._loadGuestNumCallBack);
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _loadGuestsCallBack(snapshot) {
    var guestsName = []
    var guestIds = []
    snapshot.forEach(function(data) {
      guestsName.push({'Name' : data.val().Name})
      guestIds.push(data.key)
    });
    for (i=0; i<guestIds.length;i++) {
      this._loadfbInfo(i, guestIds[i])
    }
    this.setState({
      guestIds: guestIds
    });
  }

  _loadGuests() {
    this.state.partsRef.on('value', this._loadGuestsCallBack, function(error) {
      console.error(error);
    });
  }

  _loadCapCallBack(snapshot) {
    cap = snapshot.val()
    this.setState({
      unlimited: cap > 0 ? false : true,
      limited: cap > 0 ? cap : -1
    });
    console.log('should print ' + cap)
  }

  _loadCap() {
    this.state.capRef.on('value', this._loadCapCallBack, function(error) {
      console.error(error);
    });
  }

  _loadGuestNumCallBack(snapshot) {
    guestNum = snapshot.numChildren()
    this.setState({
      guestNum: guestNum
    });
  }

  _loadGuestNum() {
    this.state.partsRef.on('value', this._loadGuestNumCallBack, function(error) {
      console.error(error);
    });
  }

  _deleteOrInvite(rowID) {
    var id = this.state.guestIds[rowID]
    if (this.props.guest) {
      if (id != this.props.fbId) {
        this.setState({
          guests: [],
          guestIds: []
        })
        this.state.partsRef.child(id).remove()
      }
    } else {
      if (this.state.unlimited || this.state.guestNum < this.state.limited) {
        var newPart = {}
        newPart[id] = {'Host': false, 'Name': this.state.guests[rowID].Name, 'Status':1}
        this.state.partsRef.update(newPart)
        console.log('should print ' + this.state.limited)
      } else {
        alert('This event is full!')
      }
    }
  }

  _addGuest(i, data) {
    var guests = this.state.guests
    guests[i] = {'Name': data.name, 'pic' : data.picture.data.url}
    this.setState({
      guestsDataSource: createListdataSource(guests),
      guests: guests
    });
  }

  _addFriends(data) {
    var friends = []
    var friendIds = []
    for (k = 0; k < data.length; k++) {
      friends[k] = {'Name': data[k].name, 'pic' : data[k].picture.data.url}
      friendIds[k] = data[k].id
    }
    this.setState({
      guestsDataSource: createListdataSource(friends),
      guests: friends,
      guestIds: friendIds
    });
  }

  _loadfbInfo(i, fbId) {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        let accessToken = data.accessToken
        const responseInfoCallback = (error, result) => {
          if (error) {
            console.log(error)
            alert('Fail to fetch facebook information: ' + error.toString());
          } else {
            if (i >= 0) {
              this._addGuest(i, result)
            } else {
              this._addFriends(result.friends.data)
            }
          }
        }

        var requestID = this.props.guest ? fbId : 'me'
        var requestStr = 'name, picture'
        if (!this.props.guest) {
          requestStr = requestStr + ', friends{name, picture}'
        }

        const infoRequest = new GraphRequest(
          '/' + requestID,
          {
            accessToken: accessToken,
            parameters: {
              fields: {
                string: requestStr
              }
            }
          },
          responseInfoCallback
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start()
      }
    )
  }
}

AppRegistry.registerComponent('GuestList', () => GuestList);

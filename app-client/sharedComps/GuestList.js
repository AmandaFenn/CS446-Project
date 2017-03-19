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
      guests: [],
      guestIds : [],
    }
    if (!this.props.guest) {
      this._loadfbInfo(-1, this.props.fbId)
    }
  }

  componentWillMount() {
    if (this.props.guest) {
      this._loadGuestsCallBack = this._loadGuestsCallBack.bind(this)
      this._loadGuests()
    }
  }

  componentWillUnmount() {
    if (this.props.guest) {
      this.state.partsRef.off('value', this._loadGuestsCallBack);
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _createListdataSource(array) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(array)
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
      var newPart = {}
      newPart[id] = {'Host': false, 'Name': this.state.guests[rowID].Name, 'Status':1}
      this.state.partsRef.update(newPart)
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
              console.log(result)
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

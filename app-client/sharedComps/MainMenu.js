import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import * as firebase from 'firebase';
import {createListdataSource} from '../utils/HelpFuncs';

export default class MainMenu extends Component {
  constructor(props){
    super(props)
    this.state = {
      name : '',
      fbId : 0,
      pic : 'https://en.facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-logo.png',
      myevents: createListdataSource([]),
      myeventIds: [],
      eventsRef : this.props.firebaseApp.database().ref('Events/'),
    }
    this._loadPersonalInfo()
  }

  componentWillUnmount() {
    this.state.eventsRef.off('value', this._eventsChangeCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _eventsChangeCallBack(snapshot) {
    var events = []
    var eventIds = []
    var fbId = this.state.fbId.toString()
    snapshot.forEach(function(data) {
      if (data.child('Participants').hasChild(fbId)) {
        events.push(data.val().Name)
        eventIds.push(data.key)
      }
    });
    this.setState({
      myevents: createListdataSource(events),
      myeventIds: eventIds
    });
  }

  _updateEvents() {
    this.state.eventsRef.on('value', this._eventsChangeCallBack, function(error) {
      console.error(error);
    });
  }

  _onSearchEvent() {
    this.props.navigator.push({
      component: SearchEvent,
      title: 'Find Events',
      passProps: {
        firebaseApp : this.props.firebaseApp,
        name : this.state.name,
        fbId : this.state.fbId
      }
    });
  }

  _onCreateEvent() {
    this.props.navigator.push({
      component: CreateEvent,
      title: 'New Event',
      rightButtonTitle: 'Create',
      passProps: {
        firebaseApp : this.props.firebaseApp,
        name : this.state.name,
        fbId : this.state.fbId
      }
    });
  }

  // Test methods, to be deleted later

  _createEventTest() {
    var eventlistRef = this.props.firebaseApp.database().ref('Events/').push()
    var date = new Date()
    eventlistRef.set({
      'Name': this.state.name + '\'s Event',
      'Date': date.toLocaleString(),
      'Location': 'Waterloo',
      'Description': '',
    })
    var addHost = {};
    var hostData = {
       'Name': this.state.name,
       'Host': true,
       'Status': 0
    }
    var newPostKey = eventlistRef.key
    addHost['/Events/' + newPostKey + '/Participants/' + this.state.fbId] = hostData;
    this.props.firebaseApp.database().ref().update(addHost)
  }

  _deleteEventTest1(snapshot) {
    var test = '1'
    snapshot.forEach(function(data) {
      if (data.val().Location == 'Waterloo') {
        console.log(data.key)
        test = data.key
      }
    })
    //console.log(test)
    var guestData = {
       'Name': 'Guest',
       'Host': false,
       'Status': 0
    }
    // add new participants
    this.props.firebaseApp.database().ref('Events/' + test + '/Participants/123456').set(guestData)

    //this.props.firebaseApp.database().ref('Events/' + test).remove()
  }

  _deleteEventTest() {
    this.state.eventsRef.once('value').then(this._deleteEventTest1.bind(this))
  }

  // Above: test methods

  _loadPersonalInfo() {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        let accessToken = data.accessToken
        // load personal information
        //alert(accessToken.toString())
        const responseInfoCallback = (error, result) => {
          if (error) {
            console.log(error)
            alert('Fail to fetch facebook information: ' + error.toString());
          } else {
            console.log(result)
            //alert('Success fetching data: ' + result.picture.data.url.toString());
            this.setState({
              name : result.name,
              pic : result.picture.data.url,
              fbId : result.id,
            });
            this._eventsChangeCallBack = this._eventsChangeCallBack.bind(this)
            this._updateEvents()
          }
        }

        const infoRequest = new GraphRequest(
          '/me',
          {
            accessToken: accessToken,
            parameters: {
              fields: {
                string: 'id, email, name, picture, friends'
              }
            }
          },
          responseInfoCallback
        );

        // Firebase authentication
        const provider = firebase.auth.FacebookAuthProvider;
        const credential = provider.credential(accessToken);
        this.props.firebaseApp.auth().signInWithCredential(credential).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('Email already associated with another account.');
            // Handle account linking here, if using.
          } else {
            console.error(error);
          }
        });

        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start()

      }
    )
  }

  _onMyEvent(rowData, rowID) {
  }

  _onLogOut() {
    // Do not call Firebase signout here.
    this._onBack()
  }
}

AppRegistry.registerComponent('MainMenu', () => MainMenu);

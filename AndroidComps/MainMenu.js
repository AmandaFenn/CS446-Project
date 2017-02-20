import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
  PermissionsAndroid
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import * as firebase from 'firebase';

export default class MainMenu extends Component {
  constructor(props){
    super(props)
    this.state = {
      name : '',
      fbId : 0,
      pic : 'https://en.facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-logo.png',
      myevents: this._createListdataSource([]),
      eventsRef : this.props.firebaseApp.database().ref('Events/'),
    }
    this._loadPersonalInfo()
  }

  componentWillUnmount() {
    this.state.eventsRef.off('value', this._eventsChangeCallBack);
  }

  _onBack() {
    if (this.props.route.index > 0) {
      this.props.navigator.pop();
    }
  }

  _createListdataSource(array) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(array)
  }

  _eventsChangeCallBack(snapshot) {
    var events = []
    var fbId = this.state.fbId.toString()
    snapshot.forEach(function(data) {
      if (data.child('Participants').hasChild(fbId)) {
        events.push(data.val().Name)
      }
      //console.log("The " + data.key + " score is " + data.val().Name);
    });
    this.setState({ myevents: this._createListdataSource(events)});
  }

  _updateEvents() {
    this.state.eventsRef.on('value', this._eventsChangeCallBack, function(error) {
      console.error(error);
    });
  }

  _onCreateEvent() {
    this.props.navigator.push({
      title : 'New Event',
      index : 2,
      name : this.state.name,
      fbId : this.state.fbId
    });
  }

  _createEventTest() {
    var test = this.props.firebaseApp.database().ref('Events/').push()
    test.set({
      'Name': this.state.name + '\'s Event',
      'Date': new Date(),
      'Location': 'Waterloo',
      'Description': '',
      'Participants': {123456: {
        'Name': this.state.name,
        'Host': true,
        'Status': 0
      }},
    })
  }

  _deleteEventTest1(snapshot) {
    var test = '1'
    snapshot.forEach(function(data) {
      if (data.val().Name == 'event2') {
        console.log(data.key)
        test = data.key
      }
    })
    //console.log(test)
    this.props.firebaseApp.database().ref('Events/' + test).remove()
  }

  _deleteEventTest() {
    // test for location
    //this.props.firebaseApp.database().ref('Events/eventtesst').remove()
    //console.log(new Date())
    this.state.eventsRef.once('value').then(this._deleteEventTest1.bind(this))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        console.log(initialPosition)
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 5000}
    );
  }

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
              fbId: result.id
            });
            this._eventsChangeCallBack = this._eventsChangeCallBack.bind(this)
            this._updateEvents()
            //console.log(result.friends)
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

  render() {
    return (
      <Image source={require('../img/menu.jpg')} style={styles.container}>
        <View style={styles.container1}>
          <View style={styles.profile}>
            <Image source={{uri: this.state.pic}}
              style={{width: 80, height: 80}} />
            <Text style={styles.text}>
              {this.state.name}
            </Text>
          </View>
          <TouchableHighlight onPress = {this._deleteEventTest.bind(this)}>
            <Text style={styles.button}> Find Events </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress = {this._onCreateEvent.bind(this)}>
            <Text style={styles.button}> Create Events </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.container2}>
          <ListView
            dataSource={this.state.myevents}
            renderRow={(rowData) => <Text style = {styles.text1}>{rowData}</Text>}
            enableEmptySections={true} />
        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom:10,
  },
  container1: {
    flex: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  container2: {
    flex: 3,
    width: 400,
    backgroundColor: 'purple'
  },
  profile: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    width: 200,
    color: '#fffff0',
    backgroundColor: '#008080',
    textAlign: 'center',
    paddingVertical:10
  },
  text: {
    color: '#fffff0',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent'
  },
  text1: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '600',
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('MainMenu', () => MainMenu);

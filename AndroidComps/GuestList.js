import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
} from 'react-native';
import FBSDK, {LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import * as firebase from 'firebase';

export default class GuestList extends Component {
  constructor(props){
    super(props)
    this.state = {
      guests: [],
      partsRef : this.props.firebaseApp.database().ref('Events/'+ this.props.route.eventId + '/Participants'),
    }
  }

  componentWillMount() {
    this._loadGuestsCallBack = this._loadGuestsCallBack.bind(this)
    this._loadGuests()
  }

  componentWillUnmount() {
    this.state.partsRef.off('value', this._loadGuestsCallBack);
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

  _loadGuestsCallBack(snapshot) {
    var guestIds = []
    snapshot.forEach(function(data) {
      //guests.push(data.val().Name)
      guestIds.push(data.key)
    });
    for (i=0; i<guestIds.length;i++) {
      this._loadfbInfo(i, guestIds[i])
    }
  }

  _loadGuests() {
    this.state.partsRef.on('value', this._loadGuestsCallBack, function(error) {
      console.error(error);
    });

  }

  _doNothing() {

  }

  _loadfbInfo(rowID, fbId) {
    return AccessToken.getCurrentAccessToken().then(
      (data) => {
        let accessToken = data.accessToken
        const responseInfoCallback = (error, result) => {
          var guests = this.state.guests
          if (error) {
            console.log(error)
            //guests[rowID] = 'https://en.facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-logo.png'
            guests[rowID] = 'test'
            //guests[rowID] = {fbId, {'name': '', 'pic':'https://en.facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-logo.png'}}
            alert('Fail to fetch facebook information: ' + error.toString());
          } else {
            //guests[rowID] = result.picture.data.url
            guests[rowID] = result.name
            //guests[rowID] = {fbId: {'name': result.name,'pic':result.picture.data.url}
            console.log(result.picture.data.url + '  ' + rowID)
          }
          this.setState({guests: this._createListdataSource(guests)})
        }

        const infoRequest = new GraphRequest(
          '/' + fbId,
          {
            accessToken: accessToken,
            parameters: {
              fields: {
                string: 'name, picture'
              }
            }
          },
          responseInfoCallback
        );

        new GraphRequestManager().addRequest(infoRequest).start()
      }
    )
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    console.log(rowData[rowID])
    return (
      <View>
        <Image source={{uri: rowData[rowID]}}
          style={{width: 40, height: 40}} />
        <TouchableHighlight onPress = {this._doNothing.bind(this)}>
          <Text style = {styles.text1}>{rowData[rowID]} </Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <ListView
            dataSource={this._createListdataSource(this.state.guests)}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true} />
          </View>
      </View>
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
  container2: {
    flex: 3,
    width: 400,
    backgroundColor: 'purple'
  },
  profile: {
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

AppRegistry.registerComponent('GuestList', () => GuestList);

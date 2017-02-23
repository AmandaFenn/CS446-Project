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
      //ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
      guestsDataSource: this._createListdataSource([]),
      partsRef : this.props.firebaseApp.database().ref('Events/'+ this.props.eventId + '/Participants'),
      guests: [],
      guestIds : []
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

  _doNothing(rowID) {
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
            var guests = this.state.guests
            guests[i] = {'Name': result.name, 'pic' : result.picture.data.url}
            this.setState({
              guestsDataSource: this._createListdataSource(guests),
              guests: guests
            });
          }
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
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start()
      }
    )
  }
  
  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.profile}>
        <Image source={{uri: rowData.pic}}
              style={{width:50, height: 50}} />
        <TouchableHighlight onPress = {this._doNothing.bind(this, rowID)}>
          <Text style = {styles.text1}> {rowData.Name} </Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <ListView
            dataSource={this.state.guestsDataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
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
    backgroundColor: 'purple',
    padding: 10
  },
  profile: {
    flex : 1,
    flexDirection: 'row',
    padding : 10
  },
  text1: {
    color: '#fffff0',
    fontSize: 40,
    fontWeight: '600',
    backgroundColor: 'transparent'
  }
});

AppRegistry.registerComponent('GuestList', () => GuestList);
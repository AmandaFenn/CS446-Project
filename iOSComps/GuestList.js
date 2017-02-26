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
      guestsDataSource: this._createListdataSource([]),
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
      guestsDataSource: this._createListdataSource(guests),
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
      guestsDataSource: this._createListdataSource(friends),
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
  
  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.profile}>
        <Image source={{uri: rowData.pic}}
              style={{width:50, height: 50}} />
        <Text style = {styles.text1}
          numberOfLines={1}> 
          {rowData.Name} 
        </Text>
        {this.props.host && <TouchableHighlight
          style={styles.button}
          onPress = {this._deleteOrInvite.bind(this, rowID)}>
          <Text style = {styles.buttontext}> {this.props.guest ? 'Delete' : 'Invite'} </Text>
        </TouchableHighlight>}
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
    backgroundColor: '#C5CAE9',
    padding: 10
  },
  profile: {
    flex : 1,
    flexDirection: 'row',
    padding : 10
  },
  text1: {
    flex: 5,
    color: '#fffff0',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingTop: 10,
    paddingLeft: 5
  },
  button: {
    flex: 3,
    alignItems: 'center',
    backgroundColor: '#303F9F',
    padding: 5
  },
  buttontext: {
    color: 'white',
    fontSize: 25,
    fontWeight: '600',
    width:100,
    textAlign: 'center',
    padding: 5,
  },
});

AppRegistry.registerComponent('GuestList', () => GuestList);
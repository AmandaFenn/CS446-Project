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
import MapView from 'react-native-maps';

export default class SuggestMap extends Component {
  constructor(props){
    super(props)
    this.state = {
      suggestions: this._createListdataSource(['Location 1','Location 2','Location 3', 'Location 4', 'Location 5']),
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }
  
  _createListdataSource(array) {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(array)
  }

  _doNothing() {
    
  }
  
  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style = {styles.location}>
        <Text style = {styles.text}
          numberOfLines={1}> 
          {rowData} 
        </Text>
        <TouchableHighlight
          style={styles.vote}
          onPress = {this._doNothing.bind(this)}>
          <Text style = {styles.votetext}> Remove </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.vote}
          onPress = {this._doNothing.bind(this)}>
          <Text style = {styles.votetext}> Vote </Text>
        </TouchableHighlight>
      </View>
    )
  }
  
  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
           latitude: 37.78825,
           longitude: -122.4324,
           latitudeDelta: 0.015,
           longitudeDelta: 0.0121,
          }}
          provider='google'
        />
        <View style={styles.emptyview}><Text style={styles.title}>Suggested locations:</Text></View>
        
        <View style={styles.suggestions}>
          <ListView 
            dataSource={this.state.suggestions}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            automaticallyAdjustContentInsets={false} />
        </View>
        
        <View style={styles.emptyview} />
        
        <TouchableHighlight
          style={styles.button}
          onPress={this._doNothing.bind(this)}>
          <Text style={styles.buttontext}> Suggest </Text>
        </TouchableHighlight>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
  },
  emptyview: {
    height: 40,
    marginHorizontal: 5
  },
  title: {
    fontSize:20,
    color:'rgba(5, 123, 253, 1.0)',
    paddingTop:10
  },
  suggestions: {
    width: 350,
    height: 130,
    backgroundColor: '#C5CAE9', 
    paddingHorizontal: 5,
    marginHorizontal: 7
  },
  location: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    padding : 5
  },
  text: {
    flex: 1,
    color: '#fffff0',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: 'transparent',
    paddingTop: 5,
    paddingLeft: 5
  },
  vote: {
    flex: 1,
    backgroundColor: '#303F9F',
    marginHorizontal: 5,
  },
  votetext: {
    fontSize: 20,
    fontWeight: '300',
    color: '#fffff0',
    textAlign: 'center',
    paddingVertical:5,
  },
  button: {
    alignItems: 'center',  
    marginHorizontal: 100,
    backgroundColor: '#303F9F',
  },
  buttontext: {
    fontSize: 25,
    fontWeight: '600',
    color: '#fffff0',
    textAlign: 'center',
    paddingVertical:6,
  },
});

AppRegistry.registerComponent('SuggestMap', () => SuggestMap);

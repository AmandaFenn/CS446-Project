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
import SharedSuggestMap from '../sharedComps/SuggestMap';

export default class SuggestMap extends SharedSuggestMap {
  constructor(props){
    super(props)
  }

  _updateNav() {
    this.props.route.RightButtonTitle = 'Done'
    this.props.route.RightButtonPress = this._updateLocation.bind(this)
  }

  _renderLocationMarkers(data) {
    return (
      <MapView.Marker
        key = {data.id}
        identifier = {data.id}
        coordinate={data.location.coordinate}
        onPress={this._onMarkerPress.bind(this,data)}
        image = {require('../img/location_marker.png')}
        >
      </MapView.Marker>
    )
  }

  _renderUserMarkers(data) {
    return (
      <MapView.Marker
        key = {data.id}
        coordinate={data.location}
        image = {require('../img/user_marker.png')}>
      </MapView.Marker>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref='map'
          style={styles.map}
          initialRegion={this.state.region}
          onPress={this._onMapPress.bind(this)}
          onMarkerPress={this._onMarkerPress.bind(this)}
          provider='google'>
          <MapView.Marker draggable
            coordinate={this.state.markerCoordinate}
            onDragEnd={this._onDragMarkerEnd.bind(this)}>
          </MapView.Marker>
          {this.state.yelpData.map(this._renderLocationMarkers.bind(this))}
          {this.state.locations.map(this._renderUserMarkers.bind(this))}
        </MapView>
        <View style={styles.suggestions}>
          <View>
            <Text>{this.state.selectedPlace.name}</Text>
            <Text> {this.state.selectedPlace ? 'Reviews: ' + this.state.selectedPlace.review_count : ''}</Text>
            <Image source = {{uri: this.state.selectedPlace.rating_img_url}} style = {{width:60, height:10}}/>
            <Image source = {{uri: this.state.selectedPlace.image_url}} style = {{width:60, height:60}}/>
            <Text>{this.state.selectedPlace ? 'Contact: ' + this.state.selectedPlace.phone : ''}</Text>
            <Text>{this.state.selectedAddress}</Text>
          </View>
        </View>
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
    width: 400,
    height: 200,
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

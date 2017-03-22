import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import MapView from 'react-native-maps';
import SharedGeoLocation from '../Modals/GeoLocation';

export default class GeoLocation extends SharedGeoLocation {
  constructor(props){
    super(props)
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:15}}>
          <MapView
            style={styles.map}
            initialRegion={this.state.region}
            onPress={this._onMapPress.bind(this)}
            onMarkerPress={this._onMarkerPress.bind(this)}
            provider='google'>
            <MapView.Marker draggable
              coordinate={this.state.markerCoordinate}
              onDragEnd={this._onDragMarkerEnd.bind(this)}>
            </MapView.Marker>
          </MapView>
        </View>  
        <View style={styles.emptyview}><Text style={styles.title}>Please select your geolocation!</Text></View>
        <View style={styles.emptyview}/>       
        <View style={styles.buttons}>          
          <TouchableHighlight
            style={styles.button}
            onPress={this._leaveModal.bind(this)}>
            <Text style={styles.buttontext}> Cancel </Text>
          </TouchableHighlight>
          
          <TouchableHighlight
            style={styles.button}
            onPress={this.props.updateGeolaction ? this.props.updateGeolaction : this._updateGeoLocation.bind(this)}>
            <Text style={styles.buttontext}> Save </Text>
          </TouchableHighlight>
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
  },
  emptyview: {
    flex: 1,
    height: 40,
    marginHorizontal: 5
  },
  title: {
    fontSize:20,
    color:'rgba(5, 123, 253, 1.0)',
    paddingTop:10
  },
  buttons: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  buttontext: {
    fontSize: 15,
    fontWeight: '300',
    width:80,
    color: 'black',
    textAlign: 'center',
    paddingVertical:5,
  },
});

AppRegistry.registerComponent('SuggestMap', () => SuggestMap);

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import {createListdataSource} from '../utils/HelpFuncs';

export default class SuggestMap extends Component {
  constructor(props){
    super(props)
    this.state = {
      suggestions: createListdataSource(['Location 1','Location 2','Location 3', 'Location 4', 'Location 5']),
      locationRef: this.props.eventRef.child('Participants/' + this.props.fbId + '/Location'),
      region: {
        latitude: this.props.GeoCoordinate.latitude,
        longitude: this.props.GeoCoordinate.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      markerCoordinate: {
        latitude: this.props.GeoCoordinate.latitude,
        longitude: this.props.GeoCoordinate.longitude,
      },
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _onMapPress(data) {
    if (data.nativeEvent.coordinate) {
      this.setState({
        markerCoordinate: data.nativeEvent.coordinate
      })
      console.log(data.nativeEvent)
      console.log(this.state.markerCoordinate.latitude)
    }
  }

  _onDragMarkerEnd(data) {
    if (data.nativeEvent.coordinate) {
      this.setState({
        markerCoordinate: data.nativeEvent.coordinate
      })
      console.log(data.nativeEvent)
      console.log(this.state.markerCoordinate.latitude)
    }
  }

  _onMarkerPress(data) {
    console.log("marker")
  }

  _updateLocation() {
    this.state.locationRef.update(this.state.markerCoordinate)
  }

  _doNothing() {
    console.log('do nothing')
  }
}

AppRegistry.registerComponent('SuggestMap', () => SuggestMap);

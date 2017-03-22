import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

export default class GeoLocation extends Component {
  constructor(props){
    super(props)
    this.state = {
      region: this.props.region ? this.props.region : {
        latitude: this.props.markerCoordinate? this.props.markerCoordinate.latitude: 43.464258,
        longitude: this.props.markerCoordinate? this.props.markerCoordinate.longitude: -80.520410,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      markerCoordinate: this.props.markerCoordinate ? this.props.markerCoordinate : {
        latitude: 43.464258,
        longitude: -80.520410,
      },
    }
  }

  _onMapPress(data) {
    if (data.nativeEvent.coordinate) {
      this.setState({
        markerCoordinate: data.nativeEvent.coordinate
      })
    }
  }
  
  _onDragMarkerEnd(data) {
    if (data.nativeEvent.coordinate) {
      this.setState({
        markerCoordinate: data.nativeEvent.coordinate
      })
    }
  }
  
  _onMarkerPress(data) {
    console.log("marker")
  }
  
  _updateGeoLocation() {
    this.props.modalParent._updateGeoCoordinate(this.state.markerCoordinate)
  }
  
  _leaveModal() {
    this.props.modalParent._setModalVisible(false)
  }
}

AppRegistry.registerComponent('GeoLocation', () => GeoLocation);

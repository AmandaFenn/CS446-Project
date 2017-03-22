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
      region: {
        latitude: 43.464258,
        longitude: -80.520410,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      markerCoordinate: {
        latitude: 43.464258,
        longitude: -80.520410,
      },
      test:0
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _onPress(data) {
    this.setState({
      markerCoordinate: data.nativeEvent.coordinate
    })
    console.log(this.state.markerCoordinate)
  }

  _doNothing() {

  }
}

AppRegistry.registerComponent('SuggestMap', () => SuggestMap);

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
    }
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _doNothing() {

  }
}

AppRegistry.registerComponent('SuggestMap', () => SuggestMap);

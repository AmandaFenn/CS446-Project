import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

export default class Menus extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedTab: 0,
    }
  }
  
  componentWillMount() {
  }

  componentDidMount() {
  }

  _onBack() {
    this.props.navigator.replace({
      component: Welcome,
      navigationBarHidden: true,
      title: 'Blink',
    });
  }
}

AppRegistry.registerComponent('Menus', () => Menus);
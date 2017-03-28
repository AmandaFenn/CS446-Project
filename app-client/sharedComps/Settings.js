import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

export default class Settings extends Component {
  constructor(props){
    super(props)
    this.state = {
      location: true,
      cover: true,
      event: true,
      settingsRef : this.props.firebaseApp.database().ref('Users/' + this.props.fbId + '/Settings'),
    }
  }

  componentWillMount() {
    this._loadSettingsInfo()
  }

  componentWillUnmount() {
    this.state.settingsRef.off('value', this._loadSettingsInfoCallBack);
  }

  _loadSettingsInfoCallBack(snapshot) {
    settings = snapshot.val()
    if (settings != null) {
      this.setState({
        location: settings.location,
        cover: settings.cover,
        event: settings.event
      })
    } else {
      this.state.settingsRef.update({
        location: this.state.location,
        cover: this.state.cover,
        event: this.state.event
      })
    }
  }

  _loadSettingsInfo() {
    this._loadSettingsInfoCallBack = this._loadSettingsInfoCallBack.bind(this)
    this.state.settingsRef.on('value', this._loadSettingsInfoCallBack, function(error) {
      console.error(error);
    });
  }

  _onSwitchLocationSetting(value) {
    this.setState({
      location: value,
    })
    this.state.settingsRef.update({'location': value})
  }

  _onSwitchCoverSetting(value) {
    this.setState({
      cover: value,
    })
    this.state.settingsRef.update({'cover': value})
  }


  _onSwitchEventSetting(value) {
    this.setState({
      event: value,
    })
    this.state.settingsRef.update({'event': value})
  }
}

AppRegistry.registerComponent('Settings', () => Settings);

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import {createListdataSource} from '../utils/HelpFuncs';

export default class Notifications extends Component {
  constructor(props){
    super(props)
    this.state = {
      notifications: createListdataSource([]),
      notificationIds: [],
      notificationsRef : this.props.firebaseApp.database().ref('Notifications/' + this.props.fbId),
    }
  }
  
  componentWillMount() {
    this._loadNotificationsCallBack = this._loadNotificationsCallBack.bind(this)
    this._loadNotifications()
  }

  componentWillUnmount() {
    this.state.notificationsRef.off('value', this._loadNotificationsCallBack);
  }
  
  _loadNotificationsCallBack(snapshot) {
    var notifications = []
    var notificationIds = []
    snapshot.forEach(function(data) {
      if (data) {        
        notifications.push(data.val())
        notificationIds.push(data.key)
      }
    });
    notifications.reverse()
    notificationIds.reverse()
    this.setState({
      notifications: createListdataSource(notifications),
      notificationIds: notificationIds
    });
  }

  _loadNotifications() {
    this.state.notificationsRef.on('value', this._loadNotificationsCallBack, function(error) {
      console.error(error);
    });
  }
  
  _viewNotification( rowData, rowID) {
    if (rowData.Status > 0) {
      this.state.notificationsRef.child(this.state.notificationIds[rowID]).update({Status: 0})
    }
  }
  
}

AppRegistry.registerComponent('Notifications', () => Notifications);
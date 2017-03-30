import React, { Component } from 'react';
import {
  View,
  ListView,
} from 'react-native';

export function createListdataSource(array) {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return ds.cloneWithRows(array);
}

export function sendNotification(notificationListRef, eventID, message) {
  var date = new Date()
  date.setSeconds(0)
  var notificationRef = notificationListRef.push()
  notificationRef.set({
    'EventID': eventID,
    'Message' : message,
    'Status': 1,
    'Date': date.toLocaleDateString(),
    'Time': date.toLocaleTimeString(),
  })
}

export function averageLatLng(location) {
  n = location.length
  lat = 0.0
  lng = 0.0
  for (i=0; i<n; i++) {
    lat += location[i].location.latitude
    lng += location[i].location.longitude
  }
  return {
    latitude: lat / n,
    longitude: lng / n,
  }
}

export function renderSeparator(sectionID , rowID , adjacentRowHighlighted) {
  return (
    <View
      key={`${sectionID}-${rowID}`}
      style={{
      height: adjacentRowHighlighted ? 4 : 1,
      backgroundColor: adjacentRowHighlighted ? '#3F51B5' : '#C5CAE9',
    }}
    />
  );
}

export function parseDateTime(date, time) {
  var dates = date.split(/[^0-9]/)
  var times = time.split(/[^0-9]/)
  var parsedDate = date
  var parsedTime = time
  if (times.length > 3) {
    parsedDate = dates[0] + '/' + dates[1] + '/' + dates[2]
    if (times[3] == 'PM') {
      times[0] = parseInt(times[0]) + 12
    }
    parsedTime = times[0] + ':' + times[1] + ':' + times[2]
  }
  return new Date(parsedDate + ' ' + parsedTime)
}

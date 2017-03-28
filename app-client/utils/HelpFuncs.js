import {
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

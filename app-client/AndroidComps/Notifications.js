import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator,
  TouchableHighlight,
  ListView
} from 'react-native';
import SharedNotifications from '../sharedComps/Notifications';

export default class Notifications extends SharedNotifications {

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight
        onPress = {this._viewNotification.bind(this, rowData, rowID)}
        onLongPress = {this._deleteNotification.bind(this, rowData, rowID)}>
        <Text style = {[styles.text1, {backgroundColor: rowData.Status ? 'grey': 'white'}]}
          numberOfLines={3}>
          {rowData.Message}, <Text style={{color: '#1A237E'}}>{rowData.Date}</Text> at <Text style={{color: '#1A237E'}}>{rowData.Time}</Text>
      </Text>
      </TouchableHighlight>
    )
  }

  _renderSeparator(sectionID , rowID , adjacentRowHighlighted) {
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

  render() {
    return (
      <View style = {{flex:1, justifyContent: 'center'}}>
      <View style= {{backgroundColor: '#3F51B5', justifyContent: 'center', alignItems: 'center', padding: 17}}>
        <Text style={styles.text2}>Notifications</Text>
          </View>
        <ListView
          dataSource={this.state.notifications}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          renderSeparator={this._renderSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
   bar: {
     backgroundColor: '#3F51B5',
   },
   text1: {
     color: '#303F9F',
     fontSize: 25,
     //fontFamily: 'sans-serif',
     fontWeight: '300',
     backgroundColor: 'transparent'
   },
   text2: {
     color: 'white',
     fontSize: 22,

   }
 });


AppRegistry.registerComponent('Notifications', () => Notifications);

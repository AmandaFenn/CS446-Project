import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import OAuthSimple from 'oauthsimple'

import {createListdataSource, averageLatLng} from '../utils/HelpFuncs';
import Constants from '../utils/Constants'


export default class SuggestMap extends Component {
  constructor(props){
    super(props)
    this.state = {
      suggestions: createListdataSource(['Location 1','Location 2','Location 3', 'Location 4', 'Location 5']),
      locationRef: this.props.eventRef.child('Participants/' + this.props.fbId + '/Location'),
      partsRef: this.props.eventRef.child('Participants'),
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
      locations: [],
      yelpData: [],
      selectedPlace: '',
      selectedAddress: ''
    }
  }

  componentWillMount() {
    this._updateNav()
    this._loadLocationCallBack = this._loadLocationCallBack.bind(this)
    this._loadLocation()
  }

  componentWillUnmount() {
    this.state.partsRef.off('value', this._loadLocationCallBack);
  }

  _onBack() {
    this.props.navigator.pop();
  }

  _updateNav() {
  }

  _loadLocationCallBack(snapshot) {
    locations = []
    allLocations = []
    var fbId = this.props.fbId

    snapshot.forEach(
      function(data) {
        value = data.val()
        console.log('location', value)
        if (value.Status == 0) {
          locationData = {
            id: data.key,
            location: value.Location
          }
          allLocations.push(locationData)
          if (fbId != data.key) {
            locations.push(locationData)
          }
        }
      }
    )

    this.setState({
      locations: locations
    })

    this._suggest(averageLatLng(allLocations))

    console.log('location1', allLocations)
    console.log('location2', locations)
  }

  _loadLocation() {
    this.state.partsRef.on('value', this._loadLocationCallBack, function(error) {
      console.error(error);
    });
  }

  _onMapPress(data) {
    if (data.nativeEvent.coordinate) {
      this.setState({
        markerCoordinate: data.nativeEvent.coordinate
      })
      //console.log(data.nativeEvent)
      //console.log(this.state.markerCoordinate.latitude)
    }
  }

  _onDragMarkerEnd(data) {
    if (data.nativeEvent.coordinate) {
      this.setState({
        markerCoordinate: data.nativeEvent.coordinate
      })
      //console.log(data.nativeEvent)
      //console.log(this.state.markerCoordinate.latitude)
    }
  }

  _onMarkerPress(data) {
    //console.log("marker", data.nativeEvent)
    //console.log("marker", data != undefined ? '1:' + data.location.state_code : '2')
    if (!data.nativeEvent) {
      console.log("marker", data.location.display_address)
      this.setState({
        selectedPlace: data,
        selectedAddress: data.location.display_address.join(", ")
      })
    }
  }

  _updateLocation() {
    this.state.locationRef.update(this.state.markerCoordinate)
  }

  _suggest(location) {
    lat = location.latitude
    lng = location.longitude
    var latlng = "ll=" + String(lat) + "," + String(lng)

    var catFilter = Constants.eventTypeMapping[this.props.type]
    var category = catFilter != '' ? 'category_filter=' + catFilter + '&' : ''

    oauth = new OAuthSimple(Constants.yelpAccess.consumerKey, Constants.yelpAccess.consumerSecret)
    request = oauth.sign({
      action: "GET",
      path: "https://api.yelp.com/v2/search",
      parameters: "limit=10&" + category + latlng,
      signatures: {
        api_key: Constants.yelpAccess.consumerKey,
        shared_secret: Constants.yelpAccess.consumerSecret,
        access_token: Constants.yelpAccess.token,
        access_secret: Constants.yelpAccess.tokenSecret},
    })

    fetch(request.signed_url, {method: "GET"}).then(function(response){
      return response.json()
    }).then(this._fetchDataCallBack.bind(this)).catch(function(error){
      console.log("Error:", error)
    })
  }

  _fetchDataCallBack(data) {
    this.setState({yelpData: data.businesses})
    this.refs.map.fitToSuppliedMarkers(
      data.businesses.map(data => (data.id)),
      true, // animated
    );
  }



  _doNothing() {
    console.log('do nothing')
  }
}

AppRegistry.registerComponent('SuggestMap', () => SuggestMap);

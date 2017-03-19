import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';

export default class ButtonWithIcon extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style = {this.props.style}>
        <TouchableHighlight
          style={this.props.styleButton}
          onPress={this.props.onClick}>
          <Text style = {this.props.styleText}> {this.props.buttonText} </Text>
        </TouchableHighlight>
        <Image
          style={this.props.styleImage}
          source={this.props.imageSource} />
      </View>

    );
  }
}

AppRegistry.registerComponent('ButtonWithIcon', () => ButtonWithIcon);

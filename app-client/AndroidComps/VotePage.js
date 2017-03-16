import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ListView,
} from 'react-native';

import SharedVotePage from '../sharedComps/VotePage';

export default class VotePage extends SharedVotePage {

}

AppRegistry.registerComponent('VotePage', () => VotePage);

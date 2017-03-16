import {
  ListView,
} from 'react-native';

export function createListdataSource(array) {
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  return ds.cloneWithRows(array);
}

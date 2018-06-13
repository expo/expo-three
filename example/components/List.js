import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  Platform,
} from 'react-native';

//https://github.com/ptelad/react-native-iphone-x-helper/blob/3c919346769e3cb9315a5254d43fcad1aadee777/index.js#L1-L11
function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)
  );
}

class List extends React.Component {
  renderSeparator = () => {
    return (
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };

  renderItem = ({ item, index }) => (
    <View>
      <TouchableHighlight
        underlayColor={'#eeeeee'}
        onPress={() => this.props.onPress(item, index)}
        style={{ paddingVertical: 16, paddingHorizontal: 12 }}>
        <Text>{item}</Text>
      </TouchableHighlight>
    </View>
  );

  keyExtractor = (item, index) => `k-${index}`;
  render() {
    const { data } = this.props;
    return (
      <FlatList
        data={data}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={this.renderItem}
        contentContainerStyle={{ paddingBottom: isIphoneX() ? 64 : 0 }}
      />
    );
  }
}
export default List;

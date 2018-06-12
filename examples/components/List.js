import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

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
      />
    );
  }
}
export default List;

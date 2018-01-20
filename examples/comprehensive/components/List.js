import React from 'react';
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

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

  render() {
    return (
      <FlatList
        style={{ backgroundColor: 'white' }}
        data={this.props.data}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={this.renderSeparator}
        renderItem={({ item, index }) => (
          <View>
            <TouchableHighlight
              underlayColor={'#eeeeee'}
              onPress={() => this.props.onPress(item, index)}
              style={{ paddingVertical: 16, paddingHorizontal: 12 }}>
              <Text style={{}}>{item}</Text>
            </TouchableHighlight>
          </View>
        )}
      />
    );
  }
}
export default List;

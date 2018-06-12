import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import Item from './Item';
import Separator from './Separator';

class List extends React.Component {
  renderItem = props => <Item {...props} onPress={this.props.onPress} />;
  keyExtractor = (item, index) => index;
  render() {
    const { style, ...props } = this.props;
    return (
      <FlatList
        style={[style, styles.container]}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={Separator}
        renderItem={this.renderItem}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
});

export default List;

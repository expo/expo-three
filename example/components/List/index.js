import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import Settings from '../../constants/Settings';
import Item from './Item';
import Separator from './Separator';

class List extends React.Component {
  renderItem = props => <Item {...props} onPress={this.props.onPress} />;
  keyExtractor = (item, index) => `item-${index}`;
  render() {
    const { style, ...props } = this.props;
    return (
      <FlatList
        style={[style, styles.container]}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingBottom: Settings.isIphoneX ? 64 : 0 }}
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

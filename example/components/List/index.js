import React from 'react';
import { FlatList, Dimensions, Platform, StyleSheet } from 'react-native';

import Item from './Item';
import Separator from './Separator';

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
  renderItem = props => <Item {...props} onPress={this.props.onPress} />;
  keyExtractor = (item, index) => `item-${index}`;
  render() {
    const { style, ...props } = this.props;
    return (
      <FlatList
        style={[style, styles.container]}
        keyExtractor={this.keyExtractor}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={{ paddingBottom: isIphoneX() ? 64 : 0 }}
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

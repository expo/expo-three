import React from 'react';
import { StyleSheet, View } from 'react-native';

export default props => (
  <View {...props} style={[styles.container, props.style]} />
);

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
    width: 'auto',
    marginLeft: 16,
    backgroundColor: '#CED0CE',
  },
});

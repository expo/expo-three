import React from 'react';
import { StyleSheet, View } from 'react-native';

export default props => <View {...props} style={[styles.container, props.style]} />;

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
    width: '86%',
    backgroundColor: '#CED0CE',
    marginLeft: '14%',
  },
});

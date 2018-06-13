import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

export default ({ item, index, onPress, style, ...props }) => (
  <View>
    <TouchableHighlight
      underlayColor={'#eeeeee'}
      {...props}
      onPress={() => onPress(item, index)}
      style={[styles.container, style]}>
      <Text style={styles.text}>{item}</Text>
    </TouchableHighlight>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingVertical: 16, paddingHorizontal: 12 },
  text: {},
});

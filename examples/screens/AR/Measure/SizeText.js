import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class SizeText extends React.PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.children}"</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 56,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#181B21',
    fontSize: 30,
    textAlign: 'center',
  },
});

export default SizeText;

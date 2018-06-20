import { Ionicons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';

const LinkButton = ({ url }) => {
  return (
    <TouchableOpacity
      style={{ padding: 8, marginRight: 8 }}
      onPress={() => {
        WebBrowser.openBrowserAsync(
          'https://github.com/expo/expo-three/blob/master/example/' + url
        );
      }}>
      <Ionicons size={24} color={Colors.primaryColor} name="md-code" />
    </TouchableOpacity>
  );
};
export default LinkButton;

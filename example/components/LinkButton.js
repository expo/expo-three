import { Ionicons } from '@expo/vector-icons';
import { Constants, WebBrowser } from 'expo';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const LinkButton = ({ url }) => {
  return (
    <TouchableOpacity
      style={{ padding: 8, marginRight: 8 }}
      onPress={() => {
        WebBrowser.openBrowserAsync(
          'https://github.com/expo/expo-three/blob/master/example/' + url
        );
      }}>
      <Ionicons
        size={24}
        color={Constants.manifest.primaryColor}
        name="md-code"
      />
    </TouchableOpacity>
  );
};
export default LinkButton;

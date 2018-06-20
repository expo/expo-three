import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StoreReview, Constants, WebBrowser } from 'expo';
import { Linking, Alert, TouchableOpacity } from 'react-native';

const LinkButton = ({ url }) => {
  return (
    <TouchableOpacity
      style={{ padding: 8, marginRight: 8 }}
      onPress={() => {
        WebBrowser.openBrowserAsync(
          'https://github.com/expo/expo-three/blob/master/example/' + url
        );
      }}>
      <Ionicons size={24} color={'black'} name="md-code" />
    </TouchableOpacity>
  );
};
export default LinkButton;

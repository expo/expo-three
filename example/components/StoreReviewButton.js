import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StoreReview, Constants } from 'expo';
import { Linking, Alert, TouchableOpacity } from 'react-native';

const StoreReviewButton = () => {
  if (!StoreReview.hasAction()) {
    return null;
  }

  return (
    <TouchableOpacity
      style={{ padding: 8, marginRight: 8 }}
      onPress={() => {
        if (StoreReview.isSupported()) {
          StoreReview.requestReview();
        } else {
          const { name } = Constants.manifest;
          Alert.alert(
            `Do you like ${name}?`,
            `Would you like to rate this app in the app store? It help's others discover ${name} too!`,
            [
              {
                text: 'OK',
                onPress: () => Linking.openURL(StoreReview.storeUrl()),
              },
              { text: 'Cancel', onPress: () => {}, style: 'cancel' },
            ],
            { cancelable: true }
          );
        }
      }}>
      <Ionicons size={24} color={'black'} name="md-heart" />
    </TouchableOpacity>
  );
};
export default StoreReviewButton;

import { ActivityIndicator, Text, View } from 'react-native';

export const LoadingView = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <ActivityIndicator />
      <Text>Loading...</Text>
    </View>
  );
};

import { ConfigContext, ExpoConfig } from '@expo/config';

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require('ts-node/register');

/**
 * If the new architecture is enabled or not.
 */
const NEW_ARCH_ENABLED = false;

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 *
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? [];

  return {
    ...config,
    plugins: [
      ...existingPlugins,
      'expo-router',
      'expo-asset',
      [
        'expo-build-properties',
        {
          android: {
            kotlinVersion: '1.8.0',
            targetSdkVersion: 33,
            newArchEnabled: NEW_ARCH_ENABLED,
          },
          ios: {
            deploymentTarget: '14.0',
            newArchEnabled: NEW_ARCH_ENABLED,
            flipper: false,
          },
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos.',
        },
      ],
    ],
  };
};

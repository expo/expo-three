const NEW_ARCH_ENABLED = false

/**
 * 
 */
export const withBuildProperties = [
  "expo-build-properties",
  {
    android: {
      kotlinVersion: "1.8.0",
      targetSdkVersion: 33,
      minSdkVersion: 21,
      newArchEnabled: NEW_ARCH_ENABLED
    },
    ios: {
      deploymentTarget: "14.0",
      newArchEnabled: NEW_ARCH_ENABLED,
      flipper: false
    }
  },
]
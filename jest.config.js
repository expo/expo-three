const withTypeScript = require('expo-module-scripts/createJestPreset');

// Example: add a library to the list of compiled ECMAScript libs (three in this case)
function withTHREE(config) {
  return {
    ...config,
    transformIgnorePatterns: [
      // The default transformIgnorePatterns from `jest-expo/jest-preset.js` but with `three` added
      'node_modules/(?!(jest-)?react-native|three|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|react-native-svg)',
      // We only want the modern js folder
      'node_modules/three/examples/!jsm',
    ],
  };
}

module.exports = {
  projects: [
    withTHREE(withTypeScript(require('jest-expo/android/jest-preset'))),
    withTHREE(withTypeScript(require('jest-expo/ios/jest-preset'))),
    withTHREE(withTypeScript(require('jest-expo/web/jest-preset'))),
  ],
};
